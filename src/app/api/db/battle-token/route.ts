import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carthage_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, token: null });
    }
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ success: false, token: null });
    }
    // Return the session token so the client can pass it to the Socket.IO server
    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ success: false, token: null }, { status: 500 });
  }
}
