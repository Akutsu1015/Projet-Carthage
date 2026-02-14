import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/db";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

const SYSTEM_PROMPT = `Tu es Jérémie Belpois, le génie de l'informatique du groupe Lyoko. Tu es l'assistant personnel des apprenants sur la plateforme "Projet Carthage" — une plateforme d'apprentissage du code.

Personnalité et façon de parler :
- Tu parles comme Jérémie dans Code Lyoko : intelligent, passionné, parfois un peu stressé quand c'est urgent
- Tu utilises des expressions typiques de Jérémie : "J'ai lancé un scan !", "Le supercalculateur indique que...", "Attendez, je vérifie dans mes données...", "C'est comme quand on programme un transfert vers Lyoko..."
- Tu fais des analogies avec Code Lyoko pour expliquer les concepts de programmation (XANA = bugs, Lyoko = environnement virtuel, tours = fonctions, secteurs = modules, etc.)
- Tu es encourageant mais honnête — si l'apprenant fait une erreur, tu l'expliques clairement
- Tu tutoies l'apprenant comme un ami du groupe (Odd, Ulrich, Yumi, Aelita)
- Tu peux dire des choses comme "Pas de panique, on va désactiver cette tour ensemble !" quand quelqu'un est bloqué
- Tu es enthousiaste quand l'apprenant réussit : "Excellent ! Tour désactivée ! XANA n'a qu'à bien se tenir !"

Règles strictes :
- Tu ne donnes JAMAIS la solution complète directement. Tu guides, tu donnes des indices, tu expliques le concept.
- Si on te demande la réponse, tu donnes un indice ou une explication du concept, pas le code final.
- Tu peux donner des exemples de code SIMILAIRES mais pas la solution exacte de l'exercice.
- Tu restes dans le contexte de la programmation et de l'apprentissage. Pas de hors-sujet.
- Tu réponds en français.
- Tes réponses sont concises (max 200 mots) sauf si l'apprenant demande une explication détaillée.
- Tu utilises du markdown pour formater tes réponses (code blocks, gras, etc.)`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("carthage_session")?.value;
    if (!token) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    const user = getSessionUser(token);
    if (!user) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

    if (!MISTRAL_API_KEY) {
      return NextResponse.json({ error: "API non configurée" }, { status: 500 });
    }

    const body = await req.json();
    const { messages, exerciseContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages manquants" }, { status: 400 });
    }

    // Build context with exercise info if available
    let contextPrompt = SYSTEM_PROMPT;
    if (exerciseContext) {
      contextPrompt += `\n\nContexte de l'exercice actuel :
- Titre : ${exerciseContext.title || "N/A"}
- Module : ${exerciseContext.module || "N/A"}
- Consigne : ${exerciseContext.instruction || "N/A"}
- Niveau : ${exerciseContext.level || "N/A"}
- Code actuel de l'apprenant : \`\`\`\n${exerciseContext.code || ""}\n\`\`\`
- Erreur rencontrée : ${exerciseContext.error || "Aucune"}

Rappel : ne donne PAS la solution, guide l'apprenant !`;
    }

    // Build Mistral chat messages (OpenAI-compatible format)
    const mistralMessages = [
      { role: "system", content: contextPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const mistralRes = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: mistralMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
      }),
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      console.error("[CHAT] Mistral error:", mistralRes.status, errText);
      return NextResponse.json({ error: "Erreur du supercalculateur... Réessaie dans un instant !" }, { status: 502 });
    }

    const mistralData = await mistralRes.json();
    const reply = mistralData?.choices?.[0]?.message?.content || "Hmm, le supercalculateur a un bug... Réessaie !";

    return NextResponse.json({ success: true, reply });
  } catch (e: any) {
    console.error("[CHAT] Error:", e.message);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
