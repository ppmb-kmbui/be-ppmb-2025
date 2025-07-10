import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";
import serverResponse from "./utils/serverResponse";

export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  try {
    const { payload } = await jwt.jwtVerify(
      token!,
      new TextEncoder().encode(process.env.JWT_SECRET),
      {}
    );
    let headers = new Headers(req.headers);
    if (payload) {
      headers.set("X-User-Id", payload.sub!.toString());
      headers.set("X-User-Admin", payload.isAdmin! as string);
    }
    return NextResponse.next({
      request: {},
    });
  } catch (e) {
    return serverResponse({success: false, message: "Tidak diizinkan", error: "JWT Token tidak valid"})
  }
}

export const config = {
  matcher: ['/((?!api/v1/auth/).*)'],
};
