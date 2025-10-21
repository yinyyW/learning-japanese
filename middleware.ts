import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  // 1. Check the request URL
  console.log('Middleware: Checking authentication for: ', req.url);
  const cookiesStore = await cookies();
  const token = cookiesStore.get('session')?.value || null;

  // 2. Protected routes 
  const protectedPaths = ["/dashboard", "/profile", "/settings"];

  const isProtected = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // 3️  Verify token if accessing protected routes
  let validJwt = null;
  if (isProtected) {
    if (!token) {
      console.log('No token found, redirecting to login');
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    validJwt = jwt.verify(token, process.env.JWT_SECRET!);
  }

  // verify jwt
  if (!validJwt) {
    console.log('Invalid token, redirecting to login');
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4️. Proceed to the requested route
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    // '/api/:path*'
  ],
  runtime: 'nodejs',
};