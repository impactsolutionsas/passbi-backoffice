import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Middleware Next.js pour toutes les routes
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Pages publiques (pas besoin d'authentification)
  const publicPages = ['/auth/login', '/auth/register', '/'];
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));

  // Si la page est publique, ne pas vérifier l'authentification
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  try {
    // Vérifier le token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    
    // Si l'utilisateur doit changer son mot de passe (première connexion) et qu'il a un rôle spécifique
    const isFirstLogin = payload.isFirstLogin as boolean;
    const role = payload.role as string;
    const requiresPasswordChange = ['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(role);
    
    if (isFirstLogin && requiresPasswordChange && !pathname.startsWith('/modules/change-password')) {
      return NextResponse.redirect(new URL('/modules/change-password', request.url));
    }
    
    // Permettre l'accès à la page demandée
    return NextResponse.next();
  } catch (error) {
    // Token invalide, rediriger vers la page de connexion
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configuration pour appliquer le middleware sur toutes les routes sauf les assets, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/* (API routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};