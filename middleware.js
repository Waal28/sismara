//import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(req) {
  const login = true;
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!login) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  // if (
  //   req.nextUrl.pathname.startsWith("/profile") ||
  //   req.nextUrl.pathname.startsWith("/my-events")
  // ) {
  //   const token = cookies().get("token");
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }
}
