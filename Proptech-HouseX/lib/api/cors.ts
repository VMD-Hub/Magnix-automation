import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CORS cho Zalo Mini App (Bearer, không cookie).
 * Origin mẫu: h5.zdn.vn / localhost Simulator.
 */
export function applyApiCors(res: NextResponse, req: NextRequest): NextResponse {
  const origin = req.headers.get("origin");
  const allow =
    !origin ||
    origin.includes("zdn.vn") ||
    origin.includes("zalo.me") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1");

  if (allow) {
    res.headers.set("Access-Control-Allow-Origin", origin ?? "*");
    res.headers.set("Vary", "Origin");
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

export function corsPreflight(req: NextRequest): NextResponse {
  return applyApiCors(new NextResponse(null, { status: 204 }), req);
}
