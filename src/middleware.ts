import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public (unprotected) routes
const PUBLIC_ROUTES = ["/", "/auth/sign-in", "/auth/sign-up"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow requests to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Block other routes for unauthenticated users
    // (withAuth will automatically handle redirection if user is unauthenticated)
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Allow access to public routes even if user is not authenticated
        if (PUBLIC_ROUTES.includes(pathname)) {
          return true;
        }

        // Block all other routes unless the user is authenticated
        return !!token;
      },
    },
  }
);

// Specify which routes the middleware applies to
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|bgImg|.*\\.(?:jpg|jpeg|gif|png|svg|webp|ico)$).*)"],
};
