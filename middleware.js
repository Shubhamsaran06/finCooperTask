import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/Customers") && !token) {
    console.log("Redirecting to login..."); 
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
