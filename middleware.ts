import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup", "/", "/carrinho", "/categoria"];
const publicApiRoutes = ["/api/banners", "/api/categorias", "/api/produtos"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verifica se é rota pública
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Verifica se é API pública
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Para rotas do painel, verifica autenticação
  if (pathname.startsWith("/painel")) {
    try {
      const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          } as HeadersInit,
        }
      );

      // Se não tem sessão, redireciona para login
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      }
    } catch (error) {
      // Se há erro na verificação, redireciona para login
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
