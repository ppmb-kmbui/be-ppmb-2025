import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";
import serverResponse from "./utils/serverResponse";

const allowedOrigins: string[] = [
  "https://ppmbkmbui.com",
  "https://www.ppmbkmbui.com",
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isPreflight = req.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const token = req.headers.get("Authorization")?.split(" ")[1];
  try {
    const { payload } = await jwt.jwtVerify(
      token!,
      new TextEncoder().encode(process.env.JWT_SECRET),
      {},
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
  } catch (e: any) {
    return serverResponse({
      success: false,
      message: "Tidak diizinkan",
      error: "JWT Token tidak valid",
      status: 401,
    });
  }
}

export const config = {
  // matcher: ['/((?!api/v1/auth/|api-doc).*)'],
  matcher: ["/api/v1((?!/auth).*)"],
};
