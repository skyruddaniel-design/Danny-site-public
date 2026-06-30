import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function requestWithNorwegianLocaleAlias(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) return request;

  const prefersNorwegian =
    /\bnb(-|_|$)|\bnn(-|_|$)/i.test(acceptLanguage) &&
    !/\bno(-|_|$)/i.test(acceptLanguage);

  if (!prefersNorwegian) return request;

  const headers = new Headers(request.headers);
  headers.set("accept-language", `no, ${acceptLanguage}`);

  return new NextRequest(request.url, { headers });
}

export default function middleware(request: NextRequest) {
  return handleI18nRouting(requestWithNorwegianLocaleAlias(request));
}

export const config = {
  matcher: ["/", "/(no|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
