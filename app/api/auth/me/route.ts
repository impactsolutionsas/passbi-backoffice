// pages/api/auth/me.js ou app/api/auth/me/route.ts pour App Router
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { JWTPayload } from '@/app/modules/auth/types/auth.types';
import { prisma } from '@/app/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    // Vérifier le token
    let decoded: JWTPayload;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    } catch (error) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
    
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
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}