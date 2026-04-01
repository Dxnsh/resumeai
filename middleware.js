import { NextResponse } from "next/server";

const rateLimitMap = new Map();

function rateLimit(ip, limit = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter(time => time > windowStart);
  requests.push(now);
  rateLimitMap.set(ip, requests);

  return requests.length <= limit;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const isAllowed = rateLimit(ip, 15, 60 * 1000);

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a minute and try again.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "15",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};