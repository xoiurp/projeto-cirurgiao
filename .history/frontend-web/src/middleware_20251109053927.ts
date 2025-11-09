import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para proteção de rotas
 * 
 * Rotas protegidas requerem autenticação
 * Rotas públicas são acessíveis sem autenticação
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  
  // Rotas protegidas (requerem autenticação)
  const protectedRoutes = ['/dashboard'];

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Verifica se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Obtém o token de autenticação dos cookies ou localStorage
  // Nota: Como não podemos acessar localStorage no middleware,
  // vamos verificar apenas se existe um cookie de sessão
  const hasAuthCookie = request.cookies.has('auth-storage');

  // Se a rota é protegida e não há autenticação, redireciona para login
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tenta acessar rota pública, redireciona para dashboard
  if (isPublicRoute && hasAuthCookie && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configuração do matcher
 * Define quais rotas o middleware deve processar
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
