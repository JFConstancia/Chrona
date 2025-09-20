// Auth.js v4 (next-auth v4)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // blokkeer alles zonder token
    authorized: ({ token }) => !!token,
  },
  pages: { signIn: "/login" }, // of laat weg voor /api/auth/signin
});

export const config = { matcher: ["/dashboard/:path*"] };
