// src/app/connect/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const startedRef = useRef(false);

  const token = searchParams.get("token") || "";
  const callbackUrl = `/connect?token=${encodeURIComponent(token)}`;

  // 1) Always kick into Google OAuth once
  useEffect(() => {
    if (!token) return;
    if (startedRef.current) return;
    if (status === "loading") return;

    startedRef.current = true;
    // This actually redirects to Google (not just NextAuth's sign-in page)
    signIn("google", { callbackUrl });
  }, [token, status, callbackUrl]);

  // 2) After we return from Google, persist tokens when we have refresh_token
  useEffect(() => {
    const g = (session as any)?.google;
    if (!token || !g?.access_token) return;
    if (!g.refresh_token) return; // wait until Google issues it

    (async () => {
      await fetch(`/api/connect/save?token=${encodeURIComponent(token)}`, { method: "POST" });
      router.replace("/connect/success");
    })();
  }, [session, token, router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Connecting your Google account…</h1>
      <p>If you are not redirected, please enable popups and try again.</p>
    </main>
  );
}
