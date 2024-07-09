import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";

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
      request: {
        headers,
      },
    });
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: new Headers(req.headers),
      },
    });
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
