import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { JWTPayload } from '@/app/modules/auth/types/auth.types';

export type NextApiRequestWithAuth = NextApiRequest & {
  user?: JWTPayload;
};

type ApiHandler = (req: NextApiRequestWithAuth, res: NextApiResponse) => Promise<void | NextApiResponse>;

export const withAuth = (handler: ApiHandler) => {
  return async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
    try {
      // Récupérer le token depuis les headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé: Token manquant' });
      }
      
      const token = authHeader.substring(7);
      
      try {
        // Vérifier le token
        const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
        req.user = decoded;
        
        // Si c'est la première connexion pour certains rôles, rediriger vers la page de changement de mot de passe
        if (decoded.isFirstLogin && 
            ['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(decoded.role) &&
            !req.url?.includes('/api/auth/change-password') &&
            !req.url?.includes('/modules/change-password')) {
          return res.status(303).json({ 
            message: 'Première connexion: Veuillez changer votre mot de passe', 
            redirectTo: '/modules/change-password' 
          });
        }
        
        // Continuer avec la requête
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ message: 'Non autorisé: Token invalide' });
      }
    } catch (error) {
      console.error('Erreur middleware auth:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};

export const withRole = (handler: ApiHandler, allowedRoles: Role[]) => {
  return withAuth(async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
    // Vérifier si l'utilisateur a le rôle requis
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé: Rôle insuffisant' });
    }
    
    // Continuer avec la requête
    return handler(req, res);
  });
};