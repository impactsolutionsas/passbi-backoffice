import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { UserService } from '@/app/modules/dashboard/components/features/users/services/UserService';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Renvoie la liste de tous les utilisateurs (accessible uniquement aux administrateurs et opérateurs)
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */ 

export async function GET(request: NextRequest) {
  try {
    console.log('API /users: Requête reçue');
    
    // Récupérer le token depuis les en-têtes Authorization
    const authHeader = request.headers.get('authorization');
    console.log('API /users: En-tête Authorization:', authHeader ? 'Présent' : 'Absent');
    
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    if (tokenFromHeader) {
      console.log('API /users: Token trouvé dans l\'en-tête Authorization:', tokenFromHeader.substring(0, 10) + '...');
    }
    
    // Récupérer le token depuis les cookies
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    if (cookieToken) {
      console.log('API /users: Token trouvé dans les cookies:', cookieToken.substring(0, 10) + '...');
    }
    
    // Utiliser le token de l'en-tête ou des cookies
    const token = tokenFromHeader || cookieToken;
    
    if (!token) {
      console.log('API /users: Aucun token trouvé ni dans l\'en-tête ni dans les cookies');
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    try {
      // Vérifier et décoder le token
      const decoded = verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
      
      console.log('API /users: Token décodé avec succès');
      console.log('API /users: ID utilisateur:', decoded.id);
      console.log('API /users: Rôle utilisateur:', decoded.role);
      
      // Vérifier le rôle de l'utilisateur
      if (!['ADMIN', 'OPERATEUR'].includes(decoded.role)) {
        console.log('API /users: Accès refusé pour le rôle:', decoded.role);
        return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
      }
      
      // Récupérer tous les utilisateurs
      const users = await UserService.getUsers();
      console.log(`API /users: ${users.length} utilisateurs récupérés avec succès`);
      
      return NextResponse.json(users, { status: 200 });
    } catch (jwtError) {
      console.error('API /users: Token invalide ou erreur de décodage:', jwtError);
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
  } catch (error) {
    console.error('API /users: Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la récupération des utilisateurs',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     description: Ajoute un nouvel utilisateur au système (accessible uniquement aux administrateurs)
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDTO'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API /users: Requête POST reçue pour ajout d\'utilisateur');
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = request.cookies.get('auth-token')?.value;
    const token = tokenFromHeader || cookieToken;
    
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier et décoder le token
    try {
      const decoded = verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
      
      // Vérifier que seuls les administrateurs peuvent ajouter des utilisateurs
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ 
          message: 'Non autorisé. Seuls les administrateurs peuvent ajouter des utilisateurs.' 
        }, { status: 403 });
      }
      
      // Récupérer les données du corps de la requête
      const userData = await request.json();
      
      // Validation des données utilisateur
      if (!userData.name || !userData.email || !userData.role) {
        return NextResponse.json({ 
          message: 'Données invalides. Nom, email et rôle sont requis.' 
        }, { status: 400 });
      }
      
      // Appeler le service d'enregistrement
      const authService = (await import('@/app/modules/auth/services/auth.service')).authService;
      const result = await authService.register(userData);
      
      if ('success' in result && result.success && 'user' in result) {
        return NextResponse.json(result, { status: 201 });
      } else {
        return NextResponse.json({ 
          message: 'code' in result ? result.message : 'Erreur lors de l\'inscription de l\'utilisateur'
        }, { status: 400 });
      }
    } catch (jwtError) {
      console.error('API /users: Token invalide ou erreur de décodage:', jwtError);
      return NextResponse.json({ message: 'Token d\'authentification invalide ou expiré' }, { status: 401 });
    }
  } catch (error) {
    console.error('API /users: Erreur lors de l\'ajout d\'un utilisateur:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de l\'ajout de l\'utilisateur. Veuillez réessayer ultérieurement.',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}