import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { verify } from 'jsonwebtoken';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UserService } from '@/app/modules/dashboard/components/features/users/services/UserService';
import { updateUserSchema } from '@/app/modules/auth/utils/auth.validation';

/**
 * Vérifier l'authentification de l'utilisateur à partir d'un token JWT ou d'une session
 * @param request La requête entrante
 * @returns L'utilisateur authentifié ou null si non authentifié
 */
async function authenticate(request: NextRequest) {
  try {
    // Essayer d'abord avec la session
    const session = await getServerSession(authOptions);
    
    if (session && session.user) {
      return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name,
        role: session.user.role
      };
    }
    
    // Si pas de session, essayer avec le token JWT
    // Récupérer le token depuis les en-têtes Authorization
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Récupérer le token depuis les cookies
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    // Utiliser le token de l'en-tête ou des cookies
    const token = tokenFromHeader || cookieToken;
    
    if (!token) {
      return null;
    }
    
    // Vérifier et décoder le token
    const decoded = verify(token, process.env.JWT_SECRET as string) as { id: string, email: string, role: string };
    
    // Créer un objet utilisateur à partir des informations du token
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return null;
  }
}

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Récupérer un utilisateur par ID
   *     description: Renvoie les détails d'un utilisateur spécifique
   *     tags:
   *       - Utilisateurs
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Détails de l'utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Non authentifié
   *       403:
   *         description: Non autorisé
   *       404:
   *         description: Utilisateur non trouvé
   *       500:
   *         description: Erreur serveur
   */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentifier l'utilisateur (via session ou token JWT)
    const currentUser = await authenticate(request);
    
    // Vérifier l'authentification
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier les autorisations (l'utilisateur peut consulter son propre profil ou les admins/opérateurs peuvent tout voir)
    if (
      currentUser.id !== params.id && 
      !['ADMIN', 'OPERATEUR'].includes(currentUser.role)
    ) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }
    
    // Récupérer l'utilisateur
    const user = await UserService.getUserById(params.id);
    
    if ('error' in user) {
      return NextResponse.json(
        { message: user.error },
        { status: user.status || 404 }
      );
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${params.id}:`, error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la récupération de l\'utilisateur',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur spécifique
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données d'entrée invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
  export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Authentifier l'utilisateur (via session ou token JWT)
      const currentUser = await authenticate(request);
      
      // Vérifier l'authentification
      if (!currentUser) {
        return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
      }
      
      // Vérifier les autorisations (l'utilisateur peut modifier son propre profil ou les admins/opérateurs peuvent tout modifier)
      if (
        currentUser.id !== params.id && 
        !['ADMIN', 'OPERATEUR'].includes(currentUser.role)
      ) {
        return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
      }
      
      // Récupérer et valider les données
      const body = await request.json();
      const validationResult = updateUserSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          {
            message: 'Données d\'entrée invalides',
            errors: validationResult.error.format()
          },
          { status: 400 }
        );
      }
      
      // Mettre à jour l'utilisateur
      const user = await UserService.updateUser(
        params.id, 
        validationResult.data, 
        currentUser.role
      );
      
      if ('error' in user) {
        return NextResponse.json(
          { message: user.error },
          { status: user.status || 500 }
        );
      }
      
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${params.id}:`, error);
      return NextResponse.json(
        { 
          message: 'Erreur serveur lors de la mise à jour de l\'utilisateur',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      );
    }
  }

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur spécifique (accessible uniquement aux administrateurs)
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentifier l'utilisateur (via session ou token JWT)
    const currentUser = await authenticate(request);
    
    // Vérifier l'authentification
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Seuls les administrateurs peuvent supprimer des utilisateurs
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }
    
    // Supprimer l'utilisateur
    const result = await UserService._performDeleteUser(params.id, currentUser);
    
    if (result && 'error' in result) {
      return NextResponse.json(
        { message: result.error },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${params.id}:`, error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la suppression de l\'utilisateur',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}