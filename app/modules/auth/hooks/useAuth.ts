'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, RegisterFormData, ChangePasswordFormData } from '../utils/auth.validation';
import { AuthResponse, AuthUser } from '../types/auth.types';
import { toast } from 'react-hot-toast';

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fonction pour obtenir le token stocké
  const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  };

  // Fonction pour stocker le token
  const storeToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      console.log('Token stocké avec succès:', token.substring(0, 10) + '...');
    }
  };

  // Fonction pour supprimer le token
  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      console.log('Token supprimé');
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          console.log('Vérification du statut avec token:', token.substring(0, 10) + '...');
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('Utilisateur authentifié:', userData);
            setUser(userData);

            // Rediriger vers la page de changement de mot de passe si nécessaire
            if (userData.isFirstLogin &&
              ['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(userData.role) &&
              window.location.pathname !== '/modules/changePassword') {
              router.push('/modules/changePassword');
            }
          } else {
            console.error('Token invalide ou expiré');
            removeToken();
            setUser(null);
          }
        } catch (err) {
          console.error('Erreur lors de la vérification du statut d\'authentification:', err);
          removeToken();
          setUser(null);
        }
      } else {
        console.log('Aucun token trouvé, utilisateur non authentifié');
        setUser(null);
      }
    };

    checkAuthStatus();
  }, [router]);

  // Fonction pour connecter un utilisateur
  const login = useCallback(async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Erreur lors de la connexion');
        throw new Error(result.message || 'Erreur lors de la connexion');
      }

      // Sauvegarder le token et les infos utilisateur
      if (result.token) {
        storeToken(result.token);
        console.log('Login réussi, token stocké');
      } else {
        console.error('Aucun token reçu du serveur');
        throw new Error('Erreur d\'authentification: token manquant');
      }
      
      setUser(result.user);
      toast.success('Connexion réussie');

      // Rediriger en fonction du statut de première connexion
      if (result.user.isFirstLogin &&
        ['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(result.user.role)) {
        router.push('/modules/changePassword');
      } else {
        router.push('/modules/dashboard');
      }

      return result as AuthResponse;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [router]);

    // Fonction pour changer le mot de passe
    const changePassword = useCallback(async (data: ChangePasswordFormData) => {
      setLoading(true);
      setError(null);
    
      try {
        const token = getStoredToken(); // Utilisez cette fonction au lieu de localStorage.getItem
        if (!token) {
          throw new Error('Non authentifié');
        }
    
        const response = await fetch('/api/changepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors du changement de mot de passe');
        }
  
        // Mettre à jour l'utilisateur local
        if (user) {
          setUser({
            ...user,
            isFirstLogin: false
          });
        }
  
        // Rediriger vers le tableau de bord
        router.push('/modules/dashboard');
        return result as { message: string, success: boolean };
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur inattendue s\'est produite');
        }
        return null;
      } finally {
        setLoading(false);
      }
    }, [router, user]);

    // Fonction pour enregistrer un utilisateur
    const register = useCallback(async (data: RegisterFormData) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Erreur lors de l\'inscription');
        }
  
        // Rediriger vers le tableau de bord
        router.push('/auth/login');
        return result as { message: string, success: boolean };
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur inattendue s\'est produite');
        }
        return null;
      } finally {
        setLoading(false);
      }
    }, [router]);


  // Fonction pour déconnecter un utilisateur
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  return {
    user,
    loading,
    error,
    register,
    login,
    changePassword,
    logout,
    isAuthenticated: !!user,
  };
}