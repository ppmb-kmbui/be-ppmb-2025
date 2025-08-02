import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jose";
import serverResponse from "./utils/serverResponse";

const allowedOrigins: string[] = [
  "https://ppmbkmbui.com",
  "https://www.ppmbkmbui.com",
];

function handleCORS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = req.method === "OPTIONS";

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // Set the specific origin header if it's allowed
  if (isAllowedOrigin) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  if (isPreflight) {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  return corsHeaders;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const corsHeaders = handleCORS(req);

  let response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (path.startsWith("/api/v1") && !path.startsWith("/api/v1/auth")) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return serverResponse({
        success: false,
        message: "Tidak diizinkan",
        error: "Missing JWT Token",
        status: 401,
      });
    }

    try {
      const { payload } = await jwt.jwtVerify(
        token,
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

  return response;
}

export const config = {
  matcher: [
    "/api/v1/:path*",
  ],
};