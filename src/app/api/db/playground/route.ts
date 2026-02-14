import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSessionUser,
  createCreation,
  updateCreation,
  deleteCreation,
  getCreation,
  getPublicCreations,
  getUserCreations,
  toggleCreationLike,
  hasUserLiked,
  incrementCreationViews,
} from "@/lib/db";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("carthage_session")?.value;
  if (!token) return null;
  return getSessionUser(token);
}

// GET — list public creations, user creations, or single creation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    const page = parseInt(searchParams.get("page") || "1");
    const sort = (searchParams.get("sort") || "recent") as "recent" | "popular";

    if (id) {
      const creation = getCreation(parseInt(id));
      if (!creation) return NextResponse.json({ success: false, error: "Création introuvable" }, { status: 404 });

      // Increment views
      incrementCreationViews(creation.id);

      // Check if current user liked it
      const user = await getUser();
      const liked = user ? hasUserLiked(user.id, creation.id) : false;

      return NextResponse.json({
        success: true,
        creation: {
          ...creation,
          liked,
          author: {
            username: creation.username,
            displayName: creation.display_name,
            avatarType: creation.avatar_type,
            avatarValue: creation.avatar_value,
            avatarColor: creation.avatar_color,
            level: creation.level,
          },
        },
      });
    }

    if (action === "my") {
      const user = await getUser();
      if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });
      const creations = getUserCreations(user.id);
      return NextResponse.json({ success: true, creations });
    }

    // Public gallery
    const { creations, total } = getPublicCreations(page, 12, sort);
    const user = await getUser();
    const enriched = creations.map((c: any) => ({
      ...c,
      liked: user ? hasUserLiked(user.id, c.id) : false,
      author: {
        username: c.username,
        displayName: c.display_name,
        avatarType: c.avatar_type,
        avatarValue: c.avatar_value,
        avatarColor: c.avatar_color,
        level: c.level,
      },
    }));

    return NextResponse.json({ success: true, creations: enriched, total, page });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST — create, update, delete, like
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, error: "Non connecté" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const { title, description, html, css, js, isPublic } = body;
      if (!title) return NextResponse.json({ success: false, error: "Titre requis" }, { status: 400 });
      const creation = createCreation(user.id, title, description || "", html || "", css || "", js || "", !!isPublic);
      return NextResponse.json({ success: true, creation });
    }

    if (action === "update") {
      const { id, ...data } = body;
      if (!id) return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
      const creation = updateCreation(id, user.id, {
        title: data.title,
        description: data.description,
        html_code: data.html,
        css_code: data.css,
        js_code: data.js,
        is_public: data.isPublic,
      });
      if (!creation) return NextResponse.json({ success: false, error: "Création introuvable ou non autorisé" }, { status: 404 });
      return NextResponse.json({ success: true, creation });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
      const ok = deleteCreation(id, user.id);
      if (!ok) return NextResponse.json({ success: false, error: "Impossible de supprimer" }, { status: 400 });
      return NextResponse.json({ success: true });
    }

    if (action === "like") {
      const { id } = body;
      if (!id) return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
      const result = toggleCreationLike(user.id, id);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ success: false, error: "Action inconnue" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
