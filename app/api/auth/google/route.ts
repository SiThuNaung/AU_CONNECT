import { NextResponse } from 'next/server';

// this route redirects user to google oauth consent screen

export async function GET() {
  const redirect_uri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`;

  const googleUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account"
    });

  return NextResponse.redirect(googleUrl);
}
