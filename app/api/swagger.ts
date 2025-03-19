import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Chemin vers vos routes API
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API PassBi',
        version: '1.0.0',
        description: 'Documentation de l\'API PassBi',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'Email de l\'utilisateur',
              },
              password: {
                type: 'string',
                description: 'Mot de passe de l\'utilisateur',
              },
            },
          },
          RegisterRequest: {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
              name: {
                type: 'string',
                description: 'Nom de l\'utilisateur',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Email de l\'utilisateur',
              },
              password: {
                type: 'string',
                description: 'Mot de passe de l\'utilisateur',
              },
              otpId: {
                type: 'string',
                nullable: true,
                description: 'ID OTP (optionnel)',
              },
              idNumber: {
                type: 'string',
                nullable: true,
                description: 'Numéro de pièce d\'identité',
              },
              pieceType: {
                type: 'string',
                enum: ['CNI', 'PASSPORT', 'PERMIS'],
                nullable: true,
                description: 'Type de pièce d\'identité',
              },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN', 'AGENT'],
                description: 'Rôle de l\'utilisateur',
              },
              photoUrl: {
                type: 'string',
                nullable: true,
                description: 'URL de la photo de profil',
              },
            },
          },
          AuthResponse: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  role: { type: 'string' },
                  pieceType: { type: 'string', nullable: true },
                  idNumber: { type: 'string', nullable: true },
                  photoUrl: { type: 'string', nullable: true },
                },
              },
              token: {
                type: 'string',
                description: 'JWT token',
              },
            },
          },
          AuthError: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Message d\'erreur',
              },
              code: {
                type: 'string',
                description: 'Code d\'erreur',
              },
            },
          },
          RegisterResponse: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Message de succès ou d\'erreur',
              },
              success: {
                type: 'boolean',
                description: 'Indique si l\'inscription a réussi',
              },
            },
          },
        },
      },
    },
  });
  return spec;
};