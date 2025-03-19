// import { User, PieceType, Role } from '@prisma/client';
// import { prisma } from '../../../lib/database/prisma';
// import { compare, hash } from 'bcryptjs';
// import { sign, verify, Secret } from 'jsonwebtoken';
// import { AuthError, AuthResponse, JWTPayload, LoginUserDTO, RegisterUserDTO } from '../types/auth.types';
// import { emailService } from '@/app/core/mail/email.service';

// export class AuthService {
//   private static instance: AuthService;

//   private constructor() {}

//   public static getInstance(): AuthService {
//     if (!AuthService.instance) {
//       AuthService.instance = new AuthService();
//     }
//     return AuthService.instance;
//   }
//   async register(data: RegisterUserDTO): Promise<{ message: string, success: boolean } | AuthError> {
//     try {
//       // Vérifier si l'utilisateur existe déjà
//       const existingUser = await prisma.user.findUnique({
//         where: { email: data.email },
//       });

//       if (existingUser) {
//         return {
//           message: "Un utilisateur avec cet email existe déjà",
//           code: "USER_EXISTS"
//         };
//       }

//       // Vérifier si la combinaison type de pièce et numéro d'identité existe déjà
//       if (data.pieceType && data.idNumber) {
//         const existingUserWithIdNumber = await prisma.user.findFirst({
//           where: {
//             pieceType: data.pieceType,
//             idNumber: data.idNumber
//           }
//         });

//         if (existingUserWithIdNumber) {
//           return {
//             message: "Un utilisateur avec cette pièce d'identité existe déjà",
//             code: "ID_NUMBER_EXISTS"
//           };
//         }
//       }

//       // Hacher le mot de passe
//       const hashedPassword = await hash(data.password, 10);

//       // Créer l'utilisateur
//       const user = await prisma.user.create({
//         data: {
//           name: data.name,
//           email: data.email,
//           password: hashedPassword,
//           otpId: data.otpId || null,
//           idNumber: data.idNumber,
//           pieceType: data.pieceType,
//           role: data.role,
//           photoUrl: data.photoUrl || null,
//         },
//       });

//       // Envoyer un email avec les identifiants de connexion
//       const emailSent = await emailService.sendCredentials(
//         user.email || '',
//         user.name,
//         user.email || '',
//         data.password // Mot de passe en clair pour l'envoi par email
//       );

//       // Retourner un message de succès
//       return {
//         message: emailSent 
//           ? "Inscription réussie. Un email avec vos identifiants a été envoyé." 
//           : "Inscription réussie mais l'envoi d'email a échoué.",
//         success: true
//       };
//     } catch (error: unknown) {
//       console.error('Erreur lors de l\'inscription:', error);
//       return {
//         message: "Erreur lors de l'inscription",
//         code: "REGISTRATION_ERROR"
//       };
//     }
//   }
//  /**

//   /**
//    * Authentifie un utilisateur en utilisant son email et mot de passe
//    */
//   async login(credentials: LoginUserDTO): Promise<AuthResponse | AuthError> {
//     try {
//       // Trouver l'utilisateur par email
//       const user = await prisma.user.findUnique({
//         where: { email: credentials.email },
//       });

//       if (!user) {
//         return {
//           message: "Email ou mot de passe incorrect",
//           code: "INVALID_CREDENTIALS"
//         };
//       }

//       // Vérifier le mot de passe
//       const passwordValid = await compare(credentials.password, user.password || '');
//       if (!passwordValid) {
//         return {
//           message: "Email ou mot de passe incorrect",
//           code: "INVALID_CREDENTIALS"
//         };
//       }

//       // Générer le token JWT
//       const token = this.generateToken(user);

//       // Retourner l'utilisateur sans le mot de passe
//       const { password: _, ...userWithoutPassword } = user;
//       return {
//         user: userWithoutPassword,
//         token,
//       };
//     } catch (error: unknown) {
//       console.error('Erreur lors de la connexion:', error);
//       return {
//         message: "Erreur lors de la connexion",
//         code: "LOGIN_ERROR"
//       };
//     }
//   }

//   /**
//    * Génère un token JWT contenant les informations de l'utilisateur
//    */
//   private generateToken(user: User): string {
//     const payload: JWTPayload = {
//       id: user.id,
//       email: user.email || '',
//       name: user.name,
//       role: user.role,
//     };

//     const secret: Secret = process.env.JWT_SECRET || 'fallback-secret';
//     return sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
//   }

//   /**
//    * Vérifie un token JWT et retourne les informations de l'utilisateur
//    */
//   async verifyToken(token: string): Promise<JWTPayload | null> {
//     try {
//       const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
//       return decoded;
//     } catch (error: unknown) {
//       return null;
//     }
//   }
// }

// // Export d'une instance du service pour une utilisation facile
// export const authService = AuthService.getInstance();


import { User, PieceType, Role } from '@prisma/client';
import { prisma } from '../../../lib/database/prisma';
import { compare, hash } from 'bcryptjs';
import { sign, verify, Secret } from 'jsonwebtoken';
import { AuthError, AuthResponse, JWTPayload, LoginUserDTO, RegisterUserDTO, ChangePasswordDTO } from '../types/auth.types';
import { emailService } from '@/app/core/mail/email.service';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  // async register(data: RegisterUserDTO): Promise<{ message: string, success: boolean } | AuthError> {
  //   try {
  //     // Vérifier si l'utilisateur existe déjà
  //     const existingUser = await prisma.user.findUnique({
  //       where: { email: data.email },
  //     });

  //     if (existingUser) {
  //       return {
  //         message: "Un utilisateur avec cet email existe déjà",
  //         code: "USER_EXISTS"
  //       };
  //     }

  //     // Vérifier si la combinaison type de pièce et numéro d'identité existe déjà
  //     if (data.pieceType && data.idNumber) {
  //       const existingUserWithIdNumber = await prisma.user.findFirst({
  //         where: {
  //           pieceType: data.pieceType,
  //           idNumber: data.idNumber
  //         }
  //       });

  //       if (existingUserWithIdNumber) {
  //         return {
  //           message: "Un utilisateur avec cette pièce d'identité existe déjà",
  //           code: "ID_NUMBER_EXISTS"
  //         };
  //       }
  //     }

  //     // Hacher le mot de passe
  //     const hashedPassword = await hash(data.password, 10);

  //     // Créer l'utilisateur avec isFirstLogin = true par défaut
  //     const user = await prisma.user.create({
  //       data: {
  //         name: data.name,
  //         email: data.email,
  //         password: hashedPassword,
  //         otpId: data.otpId || null,
  //         idNumber: data.idNumber,
  //         pieceType: data.pieceType,
  //         role: data.role,
  //         photoUrl: data.photoUrl || null,
  //         isFirstLogin: true // Par défaut, c'est la première connexion
  //       },
  //     });

  //     // Envoyer un email avec les identifiants de connexion
  //     const emailSent = await emailService.sendCredentials(
  //       user.email || '',
  //       user.name,
  //       user.email || '',
  //       data.password // Mot de passe en clair pour l'envoi par email
  //     );

  //     // Retourner un message de succès
  //     return {
  //       message: emailSent 
  //         ? "Inscription réussie. Un email avec vos identifiants a été envoyé." 
  //         : "Inscription réussie mais l'envoi d'email a échoué.",
  //       success: true
  //     };
  //   } catch (error: unknown) {
  //     console.error('Erreur lors de l\'inscription:', error);
  //     return {
  //       message: "Erreur lors de l'inscription",
  //       code: "REGISTRATION_ERROR"
  //     };
  //   }
  // }
  async register(data: RegisterUserDTO): Promise<{ message: string, success: boolean } | AuthError> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          message: "Un utilisateur avec cet email existe déjà",
          code: "USER_EXISTS"
        };
      }

      // Vérifier si la combinaison type de pièce et numéro d'identité existe déjà
      if (data.pieceType && data.idNumber) {
        const existingUserWithIdNumber = await prisma.user.findFirst({
          where: {
            pieceType: data.pieceType,
            idNumber: data.idNumber
          }
        });

        if (existingUserWithIdNumber) {
          return {
            message: "Un utilisateur avec cette pièce d'identité existe déjà",
            code: "ID_NUMBER_EXISTS"
          };
        }
      }

      // Hacher le mot de passe
      const hashedPassword = await hash(data.password, 10);

      // Créer l'utilisateur avec isFirstLogin = true par défaut
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          otpId: data.otpId || null,
          idNumber: data.idNumber,
          pieceType: data.pieceType,
          role: data.role,
          photoUrl: data.photoUrl || null,
          isFirstLogin: true // Par défaut, c'est la première connexion
        },
      });

      // Envoyer un email avec les identifiants de connexion
      const emailSent = await emailService.sendCredentials(
        user.email || '',
        user.name,
        user.email || '',
        data.password // Mot de passe en clair pour l'envoi par email
      );

      // Retourner un message de succès
      return {
        message: emailSent 
          ? "Inscription réussie. Un email avec vos identifiants a été envoyé." 
          : "Inscription réussie mais l'envoi d'email a échoué.",
        success: true
      };
    } catch (error: unknown) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        message: "Erreur lors de l'inscription",
        code: "REGISTRATION_ERROR"
      };
    }
  }
  /**
   * Authentifie un utilisateur en utilisant son email et mot de passe
   */
  async login(credentials: LoginUserDTO): Promise<AuthResponse | AuthError> {
    try {
      // Trouver l'utilisateur par email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) {
        return {
          message: "Email ou mot de passe incorrect",
          code: "INVALID_CREDENTIALS"
        };
      }

      // Vérifier le mot de passe
      const passwordValid = await compare(credentials.password, user.password || '');
      if (!passwordValid) {
        return {
          message: "Email ou mot de passe incorrect",
          code: "INVALID_CREDENTIALS"
        };
      }

      // Générer le token JWT
      const token = this.generateToken(user);

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error: unknown) {
      console.error('Erreur lors de la connexion:', error);
      return {
        message: "Erreur lors de la connexion",
        code: "LOGIN_ERROR"
      };
    }
  }

  /**
   * Change le mot de passe d'un utilisateur lors de sa première connexion
   */
  async changePassword(userId: string, data: ChangePasswordDTO): Promise<{ message: string, success: boolean } | AuthError> {
    try {
      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          message: "Utilisateur introuvable",
          code: "USER_NOT_FOUND"
        };
      }

      // Vérifier l'ancien mot de passe
      const passwordValid = await compare(data.currentPassword, user.password || '');
      if (!passwordValid) {
        return {
          message: "Mot de passe actuel incorrect",
          code: "INVALID_PASSWORD"
        };
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await hash(data.newPassword, 10);

      // Mettre à jour l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          isFirstLogin: false // Marquer que ce n'est plus la première connexion
        },
      });

      return {
        message: "Mot de passe modifié avec succès",
        success: true
      };
    } catch (error: unknown) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return {
        message: "Erreur lors du changement de mot de passe",
        code: "PASSWORD_CHANGE_ERROR"
      };
    }
  }

  /**
   * Génère un token JWT contenant les informations de l'utilisateur
   */
  private generateToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email || '',
      name: user.name,
      role: user.role,
      isFirstLogin: user.isFirstLogin || false,
    };

    const secret: Secret = process.env.JWT_SECRET || 'fallback-secret';
    return sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
  }

  /**
   * Vérifie un token JWT et retourne les informations de l'utilisateur
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
      return decoded;
    } catch (error: unknown) {
      return null;
    }
  }
}

// Export d'une instance du service pour une utilisation facile
export const authService = AuthService.getInstance();