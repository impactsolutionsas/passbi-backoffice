
// import { authService } from '@/app/modules/auth/services/auth.service';
// import { registerSchema } from '@/app/modules/auth/utils/auth.validation';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     // Récupérer le body de la requête
//     const body = await request.json();
    
//     // Valider les données d'entrée
//     const validationResult = registerSchema.safeParse(body);
    
//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           message: 'Données d\'entrée invalides',
//           errors: validationResult.error.format()
//         },
//         { status: 400 }
//       );
//     }

//     // On s'assure que password est défini avec la valeur par défaut si nécessaire
//     const userData = {
//       ...validationResult.data,
//       // Garantir que password est toujours une chaîne
//       password: validationResult.data.password || "Passer123"
//     };
    
//     // Enlever confirmPassword
//     const { confirmPassword, ...userDataWithoutConfirmPassword } = userData;
    
//     // Enregistrer l'utilisateur
//     const result = await authService.register(userDataWithoutConfirmPassword);

//     // Vérifier si une erreur s'est produite
//     if ('code' in result) {
//       return NextResponse.json(result, { status: 400 });
//     }

//     // Retourner l'utilisateur et le token
//     return NextResponse.json(result, { status: 201 });
//   } catch (error) {
//     console.error('Erreur lors de l\'inscription:', error);
//     return NextResponse.json(
//       { 
//         message: 'Erreur serveur lors de l\'inscription',
//         error: process.env.NODE_ENV === 'development' ? error : undefined
//       },
//       { status: 500 }
//     );
//   }
// }
import { authService } from '@/app/modules/auth/services/auth.service';
import { registerSchema } from '@/app/modules/auth/utils/auth.validation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription utilisateur
 *     description: Permet à un utilisateur de s'inscrire avec ses informations personnelles
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Données d'entrée invalides ou erreur d'inscription
 *         content:
 *           application/json:
 *             schema:
 *               anyOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     errors:
 *                       type: object
 *                 - $ref: '#/components/schemas/AuthError'
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
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Données d\'entrée invalides',
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // On s'assure que password est défini avec la valeur par défaut si nécessaire
    const userData = {
      ...validationResult.data,
      // Garantir que password est toujours une chaîne
      password: validationResult.data.password || "Passer123"
    };
    
    // Enlever confirmPassword
    const { confirmPassword, ...userDataWithoutConfirmPassword } = userData;
    
    // Enregistrer l'utilisateur
    const result = await authService.register(userDataWithoutConfirmPassword);

    // Vérifier si une erreur s'est produite
    if ('code' in result) {
      return NextResponse.json(result, { status: 400 });
    }

    // Retourner l'utilisateur et le token
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { 
        message: 'Erreur serveur lors de l\'inscription',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}