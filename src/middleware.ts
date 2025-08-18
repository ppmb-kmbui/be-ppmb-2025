import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";
import serverResponse from "./utils/serverResponse";
import { after } from "node:test";
import { headers } from "next/headers";

const allowedOrigins: string[] = [
  "https://ppmbkmbui.com",
  "https://www.ppmbkmbui.com",
  "http://localhost:3000",
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (!isAllowedOrigin) return serverResponse({
      success: false,
      message: "Tidak diizinkan",
      error: "PERGI KAMU ORIGIN TAK DIUNDANG HAHAHA",
      status: 401,
  });
  
  let corsHeader = new Headers();
  let reqHeader = new Headers(req.headers);

  corsHeader.set("Access-Control-Allow-Origin", origin);
  corsHeader.set("Access-Control-Allow-Credentials", "true");
  corsHeader.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  corsHeader.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  const isPreflight = req.method === "OPTIONS";

  if (isPreflight) {
    return NextResponse.json(
      { ok: true },
      { status: 200, headers: corsHeader }
    );
  }

  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/v1/auth/")) {
    const afterResponse = NextResponse.next({request: {headers: reqHeader}});
    corsHeader.forEach((value, key) => {
      afterResponse.headers.set(key, value);
    });
    return afterResponse;
  }

  const token = req.headers.get("Authorization")?.split(" ")[1];

  try {
    const { payload } = await jwt.jwtVerify(
      token!,
      new TextEncoder().encode(process.env.JWT_SECRET),
      {},
    );
    if (payload) {
      reqHeader.set("X-User-Id", payload.sub!.toString());
      reqHeader.set("X-User-Admin", payload.isAdmin! as string);
    }
    const afterResponse = NextResponse.next({request: {headers: reqHeader}});
    corsHeader.forEach((value, key) => {
      afterResponse.headers.set(key, value);
    });
    return afterResponse;
    
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
  matcher: ["/api/:path*"],
};