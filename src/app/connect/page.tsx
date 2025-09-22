// app/connect/page.tsx (server component)
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { trialService } from "../api/common/services/trial.service";

type Props = { searchParams: Promise<{ token?: string }> }

export default async function ConnectPage({ searchParams }: Props) {
  const searchParameters = await searchParams;
  const token = searchParameters?.token ?? "";
  const phone = token ? trialService.verifyPhoneToken(token) : null;
  if (!phone) return <p>Invalid or expired link.</p>;

  const session = await auth();
  const google = (session as any)?.google;

  if (google?.access_token) {
    await trialService.saveGooglePhoneTokenAsync(
      phone,
      google.access_token,
      google.refresh_token ?? "",
      google.expires_at ?? 0,
      google.email ?? ""
    );

    redirect("/connect/success");
  }

  const callbackUrl = `/connect?token=${encodeURIComponent(token)}`;

  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Connect your Google account
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-600">
            After signing in, you’ll be auto-connected.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              className="rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              href={`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            >
              Connect <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
