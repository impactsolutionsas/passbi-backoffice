import { authService } from '@/app/modules/auth/services/auth.service';
import { loginSchema } from '@/app/modules/auth/utils/auth.validation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentification utilisateur
 *     description: Permet à un utilisateur de s'authentifier avec son email et son mot de passe
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données d'entrée invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: object
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le body de la requête
    const body = await request.json();
    
    // Valider les données d'entrée
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Données d\'entrée invalides',
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // Authentifier l'utilisateur
    const result = await authService.login(validationResult.data);

    // Vérifier si une erreur s'est produite
    if ('code' in result) {
      return NextResponse.json(result, { status: 401 });
    }

    // Retourner l'utilisateur et le token
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la connexion',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}