import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
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
