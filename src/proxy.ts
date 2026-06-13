import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'dev-secret');

const ADMIN_PATHS = ['/admin/dashboard'];
const LOGIN_PATH = '/admin/login';

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect admin dashboard paths
  if (ADMIN_PATHS.some(p => path.startsWith(p))) {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token invalid or expired
      const response = NextResponse.redirect(new URL(LOGIN_PATH, req.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
