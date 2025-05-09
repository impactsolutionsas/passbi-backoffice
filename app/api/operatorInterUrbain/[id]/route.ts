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
 * GET - Récupérer un opérateur par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API /operatorInterUrbain/${params.id}: Requête GET reçue`);
    
    // Authentifier l'utilisateur
    const currentUser = await authenticate(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier le rôle de l'utilisateur
    if (!['ADMIN', 'OPERATEUR'].includes(currentUser.role)) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }
    
    // Récupérer l'opérateur par son ID
    const operator = await OperatorService.getOperatorById(params.id);
    
    if ('error' in operator) {
      return NextResponse.json(
        { message: operator.error },
        { status: operator.status || 404 }
      );
    }
    
    return NextResponse.json(operator, { status: 200 });
  } catch (error) {
    console.error(`API /operatorInterUrbain/${params.id}: Erreur lors de la récupération:`, error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la récupération de l\'opérateur',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Mettre à jour un opérateur par son ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API /operatorInterUrbain/${params.id}: Requête PUT reçue`);
    
    // Authentifier l'utilisateur
    const currentUser = await authenticate(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier que seuls les administrateurs peuvent modifier des opérateurs
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: 'Non autorisé. Seuls les administrateurs peuvent modifier des opérateurs.' 
      }, { status: 403 });
    }
    
    // Récupérer les données avec formData pour gérer les fichiers
    const formData = await request.formData();
    const operatorData = JSON.parse(formData.get('data') as string);
    const logoFile = formData.get('logo') as File || undefined;
    
    // Appeler le service pour mettre à jour l'opérateur
    const result = await OperatorService.updateOperator(params.id, operatorData, logoFile);
    
    if ('error' in result) {
      return NextResponse.json(
        { message: result.error },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`API /operatorInterUrbain/${params.id}: Erreur lors de la mise à jour:`, error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la mise à jour de l\'opérateur',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un opérateur par son ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API /operatorInterUrbain/${params.id}: Requête DELETE reçue`);
    
    // Authentifier l'utilisateur
    const currentUser = await authenticate(request);
    
    if (!currentUser) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier que seuls les administrateurs peuvent supprimer des opérateurs
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({ 
        message: 'Non autorisé. Seuls les administrateurs peuvent supprimer des opérateurs.' 
      }, { status: 403 });
    }
    
    // Supprimer l'opérateur
    const result = await OperatorService.deleteOperator(params.id);
    
    if ('error' in result) {
      return NextResponse.json(
        { message: result.error },
        { status: result.status || 500 }
      );
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`API /operatorInterUrbain/${params.id}: Erreur lors de la suppression:`, error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de la suppression de l\'opérateur',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}