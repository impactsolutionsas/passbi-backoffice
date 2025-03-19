import { authService } from '@/app/modules/auth/services/auth.service';
import { changePasswordSchema } from '@/app/modules/auth/utils/auth.validation';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { JWTPayload } from '@/app/modules/auth/types/auth.types';

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Changer le mot de passe lors de la première connexion
 *     description: Permet à un utilisateur de changer son mot de passe lors de sa première connexion
 *     tags:
 *       - Authentification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Données d'entrée invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Non autorisé: Token manquant' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    
    // Vérifier le token
    let decoded: JWTPayload;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    } catch (error) {
      return NextResponse.json({ message: 'Non autorisé: Token invalide' }, { status: 401 });
    }
    
    // Récupérer le body de la requête
    const body = await request.json();
    
    // Valider les données d'entrée
    const validationResult = changePasswordSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Données d\'entrée invalides',
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // Changer le mot de passe
    const result = await authService.changePassword(decoded.id, validationResult.data);

    // Vérifier si une erreur s'est produite
    if ('code' in result) {
      return NextResponse.json(result, { status: 400 });
    }

    // Retourner un message de succès
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors du changement de mot de passe',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}