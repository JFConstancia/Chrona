// src/app/api/connect/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { trialService } from "../../common/services/trial.service";
import { normalizePhoneNumber } from "../../common/utility/phone-number.utility";

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const verifiedPhoneNumber = token ? trialService.verifyPhoneToken(token) : null;
  const normalizedPhoneNumber = normalizePhoneNumber(verifiedPhoneNumber);

  if (!normalizedPhoneNumber) {
    return NextResponse.json({ ok: false, error: "Invalid or expired phone token" }, { status: 400 });
  }

  const session = await auth();
  const google = (session as any)?.google;

  if (!google?.access_token) {
    return NextResponse.json({ ok: false, error: "Not signed in with Google" }, { status: 401 });
  }

  // Debug
  console.log("[CONNECT-SAVE] tokens", {
    normalizedPhoneNumber,
    hasAccessToken: !!google.access_token,
    hasRefreshToken: !!google.refresh_token,
    accessTokenLast8: google.access_token?.slice(-8),
    email: google.email,
  });

  await trialService.saveGooglePhoneTokenAsync(
    normalizedPhoneNumber,
    google.access_token,
    google.refresh_token ?? "",
    google.expires_at ?? 0,
    google.email ?? ""
  );

  return NextResponse.json({ ok: true });
}
