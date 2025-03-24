import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/app/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('API /me: Requête reçue');
    
    // Récupérer le token depuis les cookies ou l'en-tête Authorization
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Récupérer le token depuis les cookies si pas dans l'en-tête
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    // Utiliser le token de l'en-tête ou des cookies
    const token = tokenFromHeader || cookieToken;
    
    if (!token) {
      console.log('API /me: Aucun token trouvé');
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    try {
      // Vérifier et décoder le token
      const decoded = verify(token, process.env.JWT_SECRET as string) as { id: string };
      
      // Récupérer l'utilisateur sans son mot de passe
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isFirstLogin: true,
          otpId: true,
          photoUrl: true,
          pieceType: true,
          idNumber: true,
        }
      });
      
      if (!user) {
        console.log('API /me: Utilisateur non trouvé dans la base de données');
        return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
      }
      
      console.log('API /me: Utilisateur trouvé, retourne les données');
      return NextResponse.json(user);
    } catch (jwtError) {
      console.error('API /me: Token invalide:', jwtError);
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
  } catch (error) {
    console.error('API /me: Erreur lors de la récupération du profil:', error);
    return NextResponse.json({ 
      message: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}