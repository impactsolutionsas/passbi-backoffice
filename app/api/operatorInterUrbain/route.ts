import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OperatorService } from '@/app/modules/dashboard/components/features/operatorInterUrbain/services/operator.service';

/**
 * Authentifier l'utilisateur à partir d'un token JWT ou d'une session
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
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    const cookieToken = request.cookies.get('auth-token')?.value;
    const token = tokenFromHeader || cookieToken;
    
    if (!token) {
      return null;
    }
    
    // Vérifier et décoder le token
    const decoded = verify(token, process.env.JWT_SECRET as string) as { id: string, email: string, role: string };
    
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
 * GET - Récupérer tous les opérateurs
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API /operatorInterUrbain: Requête GET reçue');
    
    // Authentifier l'utilisateur
    const currentUser = await authenticate(request);
    
    if (!currentUser) {
      console.log('API /operatorInterUrbain: Non authentifié');
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier le rôle de l'utilisateur
    if (!['ADMIN', 'OPERATEUR'].includes(currentUser.role)) {
      console.log('API /operatorInterUrbain: Accès refusé pour le rôle:', currentUser.role);
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }
    
    // Récupérer tous les opérateurs
    const operators = await OperatorService.getOperators();
    console.log(`API /operatorInterUrbain: ${operators.length} opérateurs récupérés avec succès`);
    
    return NextResponse.json(operators, { status: 200 });
  } catch (error) {
    console.error('API /operatorInterUrbain: Erreur lors de la récupération des opérateurs:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la récupération des opérateurs',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Ajouter un nouvel opérateur
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API /operatorInterUrbain: Requête POST reçue pour ajout d\'opérateur');
    
    // Authentifier l'utilisateur
    const currentUser = await authenticate(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier que seuls les administrateurs peuvent ajouter des opérateurs
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: 'Non autorisé. Seuls les administrateurs peuvent ajouter des opérateurs.' 
      }, { status: 403 });
    }
    
    // Récupérer les données avec formData pour gérer les fichiers
    const formData = await request.formData();
    const operatorData = JSON.parse(formData.get('data') as string);
    const logoFile = formData.get('logo') as File || undefined;
    
    // Validation des données principales
    if (!operatorData.name || !operatorData.email || !operatorData.countryId) {
      return NextResponse.json({ 
        message: 'Données invalides. Nom, email et pays sont requis.' 
      }, { status: 400 });
    }
    
    // Appeler le service pour créer l'opérateur
    const result = await OperatorService.addOperator(operatorData, logoFile);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json({ 
        message: result.error || 'Erreur lors de l\'ajout de l\'opérateur'
      }, { status: result.status || 400 });
    }
  } catch (error) {
    console.error('API /operatorInterUrbain: Erreur lors de l\'ajout d\'un opérateur:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de l\'ajout de l\'opérateur. Veuillez réessayer ultérieurement.',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}