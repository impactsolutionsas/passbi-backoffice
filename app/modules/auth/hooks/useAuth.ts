// 'use client';

// import { useCallback, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { LoginFormData, RegisterFormData } from '../utils/auth.validation';
// import { AuthResponse, AuthUser } from '../types/auth.types';

// export default function useAuth() {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Fonction pour enregistrer un utilisateur
//   const register = useCallback(async (data: RegisterFormData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Erreur lors de l\'inscription');
//       }

//       // Sauvegarder le token et les infos utilisateur
//       localStorage.setItem('auth_token', result.token);
//       setUser(result.user);

//       // Rediriger vers le tableau de bord
//       router.push('/auth/login');
//       return result as AuthResponse;
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Une erreur inattendue s\'est produite');
//       }
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   // Fonction pour connecter un utilisateur
//   const login = useCallback(async (data: LoginFormData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Erreur lors de la connexion');
//       }

//       // Sauvegarder le token et les infos utilisateur
//       localStorage.setItem('auth_token', result.token);
//       setUser(result.user);

//       // Rediriger vers le tableau de bord
//       router.push('/modules/dashboard');
//       return result as AuthResponse;
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Une erreur inattendue s\'est produite');
//       }
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   // Fonction pour déconnecter un utilisateur
//   const logout = useCallback(() => {
//     localStorage.removeItem('auth_token');
//     setUser(null);
//     router.push('/auth/login');
//   }, [router]);

//   return {
//     user,
//     loading,
//     error,
//     register,
//     login,
//     logout,
//     isAuthenticated: !!user,
//   };
// }


'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, RegisterFormData, ChangePasswordFormData } from '../utils/auth.validation';
import { AuthResponse, AuthUser } from '../types/auth.types';

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Changez cet endpoint pour celui qui vérifie l'état d'authentification
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);

            // Rediriger vers la page de changement de mot de passe si nécessaire
            if (userData.isFirstLogin &&
              ['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(userData.role) &&
              window.location.pathname !== '/modules/changePassword') {
              router.push('/modules/changePassword');
            }
          } else {
            // Token invalide ou expiré
            localStorage.removeItem('auth_token');
          }
        } catch (err) {
          console.error('Erreur lors de la vérification du statut d\'authentification:', err);
        }
      }
    };

    checkAuthStatus();
  }, [router]);

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
        throw new Error(result.message || 'Erreur lors de la connexion');
      }

      // Sauvegarder le token et les infos utilisateur
      localStorage.setItem('auth_token', result.token);
      setUser(result.user);

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
      const token = localStorage.getItem('auth_token');
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