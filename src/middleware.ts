import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Public pages - accessible without authentication
  const isAuthPage = pathname === "/" || pathname === "/forgot-password";

  // If user is not logged in and trying to access private route
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is logged in and trying to access login or forgot password page
  if (token && isAuthPage) {
    // Redirect to dashboard or default authenticated page
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Role-based access control - Currently allowing all routes for both roles
  // You can add restrictions later if needed
  const role: string = (token?.userRole as string) || "user";

  // Optional: Add role-specific restrictions here if needed in the future
  // Example:
  // const restrictedPaths: Record<string, string[]> = {
  //   user: ["/admin"],  // Users cannot access /admin routes
  // };
  //
  // const restrictedForRole = restrictedPaths[role] || [];
  // const isRestricted = restrictedForRole.some((path) =>
  //   pathname.startsWith(path)
  // );
  //
  // if (isRestricted) {
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/forgot-password",
    "/dashboard/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    // Add other protected routes
  ],
};
