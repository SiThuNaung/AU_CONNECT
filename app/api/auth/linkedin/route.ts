// app/api/auth/linkedin/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
    scope: "openid profile email",
    state: crypto.randomUUID(), // prevent CSRF
  });

  return NextResponse.redirect(
    "https://www.linkedin.com/oauth/v2/authorization?" + params.toString()
  );
}
