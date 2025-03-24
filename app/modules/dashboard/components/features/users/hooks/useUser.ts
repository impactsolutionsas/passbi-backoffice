'use client';
import { useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { RegisterUserDTO } from '@/app/modules/auth/types/auth.types';
import { User } from '@prisma/client';

// Interface pour les utilisateurs avec ID
export interface UserWithId extends RegisterUserDTO {
    id: string;     
    createdAt?: string;
}

export const useUser = () => {
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Récupérer tous les utilisateurs
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Assurez-vous que cet en-tête est correctement formaté
                }
            });

            // Vérifier d'abord le statut de la réponse
            if (response.status === 401) {
                throw new Error('Non authentifié');
            } else if (response.status === 403) {
                throw new Error('Non autorisé');
            } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors du chargement des utilisateurs');
            }

            const data = await response.json();
            setUsers(data);
            return data;
        } catch (err) {
            console.error('Erreur de chargement:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer l'utilisateur courant
    const fetchCurrentUser = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('Tentative de récupération de l\'utilisateur courant...');

            // Récupérer le token du localStorage de manière sécurisée
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                console.log('Aucun token trouvé dans localStorage');
                return null;
            }

            console.log('Token trouvé dans localStorage:', token.substring(0, 10) + '...');

            // Use Record<string, string> for headers to allow dynamic properties
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', // Pour les cookies
                headers
            });

            const responseText = await response.text();
            console.log('Statut de réponse:', response.status);
            console.log('Contenu de réponse brut:', responseText);

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
                console.log('Données parsées:', data);
            } catch (parseError) {
                console.error('Erreur de parsing JSON:', parseError);
                throw new Error('Format de réponse invalide');
            }

            if (!response.ok) {
                console.error('Réponse non-OK:', response.status, data.message || 'Erreur inconnue');
                throw new Error(data.message || 'Erreur lors du chargement de l\'utilisateur courant');
            }

            setCurrentUser(data);
            return data;
        } catch (err) {
            console.error('Erreur complète dans fetchCurrentUser:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initializeUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                console.log('Aucun token trouvé lors de l\'initialisation, authentification requise');
                return;
            }

            const user = await fetchCurrentUser();
            if (user) { // Vérifier que l'utilisateur est bien authentifié
                await fetchUsers();
            }
        };

        initializeUser();
    }, [fetchCurrentUser, fetchUsers]);

    // Ajouter un utilisateur
    const addUser = useCallback(async (userData: RegisterUserDTO): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch('/api/users', {  // Utiliser l'endpoint /api/users pour ajouter
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de l\'ajout de l\'utilisateur');
            }

            if (result.success && result.user) {
                const newUser: UserWithId = {
                    ...userData,
                    id: result.user.id,
                    password: '', // Ne pas stocker le mot de passe en clair côté client
                    createdAt: new Date().toISOString()
                };

                setUsers(prev => [...prev, newUser]);

                Swal.fire({
                    title: 'Succès!',
                    text: result.message || 'Utilisateur ajouté avec succès',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Rafraîchir la liste des utilisateurs
                await fetchUsers();

                return true;
            }

            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');

            Swal.fire({
                title: 'Erreur!',
                text: err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de l\'utilisateur',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    // Méthode de suppression
    const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // Vérifier si l'utilisateur est authentifié
            if (!currentUser) {
                await fetchCurrentUser();
                if (!currentUser) {
                    throw new Error('Vous devez être connecté pour effectuer cette action');
                }
            }

            // Confirmation avant suppression
            const confirmResult = await Swal.fire({
                title: 'Êtes-vous sûr?',
                text: "Cette action ne peut pas être annulée!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer!',
                cancelButtonText: 'Annuler'
            });

            if (!confirmResult.isConfirmed) {
                setLoading(false);
                return false;
            }

            // Récupérer le token pour l'authentification
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                throw new Error('Non authentifié');
            }

            // Vérifier les autorisations (seul un admin peut supprimer)
            if (currentUser.role !== 'ADMIN') {
                Swal.fire({
                    title: 'Accès refusé!',
                    text: 'Seuls les administrateurs peuvent supprimer des utilisateurs',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                setLoading(false);
                return false;
            }

            // Empêcher la suppression de son propre compte
            const userToDelete = users.find(user => user.id === userId);
            if (userToDelete && userToDelete.email === currentUser.email) {
                Swal.fire({
                    title: 'Action non autorisée!',
                    text: 'Vous ne pouvez pas supprimer votre propre compte',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                setLoading(false);
                return false;
            }

            // Effectuer la suppression
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la suppression de l\'utilisateur');
            }

            // Mise à jour de l'état local
            setUsers(users.filter(user => user.id !== userId));

            Swal.fire({
                title: 'Supprimé!',
                text: 'L\'utilisateur a été supprimé avec succès',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');

            Swal.fire({
                title: 'Erreur!',
                text: err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression de l\'utilisateur',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return false;
        } finally {
            setLoading(false);
        }
    }, [currentUser, fetchCurrentUser, users]);

    // Modifier un utilisateur
    const editUser = useCallback(async (userId: string, userData: Partial<RegisterUserDTO>): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // Vérifier si l'utilisateur est authentifié
            if (!currentUser) {
                await fetchCurrentUser();
                if (!currentUser) {
                    throw new Error('Vous devez être connecté pour effectuer cette action');
                }
            }

            // Récupérer le token pour l'authentification
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                throw new Error('Non authentifié');
            }

            // Récupérer l'utilisateur à modifier pour vérification des autorisations
            const userToEdit = users.find(user => user.id === userId);

            if (!userToEdit) {
                throw new Error('Utilisateur non trouvé');
            }

            // Vérifier les autorisations basées sur les rôles
            if (currentUser.role === 'OPERATEUR' && userToEdit.role === 'ADMIN') {
                Swal.fire({
                    title: 'Accès refusé!',
                    text: 'Vous n\'êtes pas autorisé à modifier un administrateur',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

                setLoading(false);
                return false;
            }

            // Effectuer la mise à jour
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la mise à jour de l\'utilisateur');
            }

            // Mettre à jour l'état local
            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, ...userData, id: userId } : user
            );
            setUsers(updatedUsers);

            Swal.fire({
                title: 'Succès!',
                text: 'Utilisateur mis à jour avec succès',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');

            Swal.fire({
                title: 'Erreur!',
                text: err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour de l\'utilisateur',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return false;
        } finally {
            setLoading(false);
        }
    }, [currentUser, fetchCurrentUser, users]);

    // Récupérer un utilisateur par ID
    const getUserById = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            // Récupérer le token pour l'authentification
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement de l\'utilisateur');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtenir les rôles disponibles en fonction du rôle de l'utilisateur actuel
    const getAvailableRoles = useCallback((currentUserRole: string): string[] => {
        if (currentUserRole === 'ADMIN') {
            return ['ADMIN', 'OPERATEUR', 'CAISSIER', 'CONTROLLER', 'USER'];
        } else if (currentUserRole === 'OPERATEUR') {
            return ['CAISSIER', 'CONTROLLER'];
        }
        return [];
    }, []);

    return {
        users,
        setUsers,
        currentUser,
        loading,
        error,
        fetchUsers,
        fetchCurrentUser,
        addUser,
        deleteUser,
        editUser,
        getUserById,
        getAvailableRoles
    };
};