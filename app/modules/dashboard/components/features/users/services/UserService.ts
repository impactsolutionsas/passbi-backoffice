import { prisma } from '@/app/lib/database/prisma';
import { Prisma, User, Role } from '@prisma/client';
import { RegisterUserDTO } from '@/app/modules/auth/types/auth.types';
import { authService } from '@/app/modules/auth/services/auth.service';
import Swal from 'sweetalert2';

// Étendre RegisterUserDTO pour inclure l'id
interface UserWithId extends RegisterUserDTO {
    id: string;
}

interface ErrorResponse {
    error: string;
    status?: number;
}

export const UserService = {
    // Méthodes backend
    
    // Récupérer tous les utilisateurs
    async getUsers() {
        try {
          // Exclure le mot de passe des données retournées
          const users = await prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              // Ne pas inclure le mot de passe
            }
          });
          
          // Formater la date de création si nécessaire
          return users.map(user => ({
            ...user,
            createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
            password: '' // Pour respecter l'interface UserWithId
          }));
        } catch (error) {
          console.error('Erreur dans UserService.getUsers:', error);
          throw error;
        }
      },

 // Récupérer un utilisateur par ID
 getUserById: async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                password: false,
            },
        });

        if (!user) {
            // Ne pas utiliser Swal dans le backend, uniquement côté client
            return { error: 'Utilisateur non trouvé', status: 404 } as ErrorResponse;
        }

        return user;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
        
        // Ne pas utiliser Swal dans le backend, uniquement côté client
        throw new Error(`Erreur lors de la récupération de l'utilisateur`);
    }
},


// Mettre à jour un utilisateur
updateUser: async (id: string, userData: Partial<RegisterUserDTO>, currentUserRole: string, users?: UserWithId[], setUsers?: (users: UserWithId[]) => void) => {
    try {
        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            // Ne pas utiliser Swal dans le backend
            return { error: 'Utilisateur non trouvé', status: 404 } as ErrorResponse;
        }

        // Vérifier les autorisations basées sur les rôles
        if (currentUserRole === 'OPERATEUR' && existingUser.role === 'ADMIN') {
            // Ne pas utiliser Swal dans le backend
            return {
                error: 'Vous n\'êtes pas autorisé à modifier un administrateur',
                status: 403,
            } as ErrorResponse;
        }

        // Mise à jour du mot de passe si nécessaire
        if (userData.password) {
            // Dans une application réelle, il faudrait hacher le mot de passe ici
            // userData.password = await bcrypt.hash(userData.password, 10);
        }

        // Mettre à jour l'utilisateur dans la base de données
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        // Cette partie est pour le frontend uniquement
        if (users && setUsers) {
            const updatedUsers = users.map(user => 
                user.id === id ? { ...user, ...userData, id } : user
            );
            setUsers(updatedUsers);
            
            // Swal est uniquement utilisé côté client
            Swal.fire({
                title: 'Succès!',
                text: 'Utilisateur mis à jour avec succès',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }

        return updatedUser;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Gérer les erreurs Prisma côté backend sans Swal
                return { 
                    error: 'Cet email est déjà utilisé par un autre utilisateur', 
                    status: 400 
                } as ErrorResponse;
            }
        }
        
        return { 
            error: 'Erreur lors de la mise à jour de l\'utilisateur', 
            status: 500 
        } as ErrorResponse;
    }
},

// Interface pour éditer l'utilisateur (peut appeler updateUser en interne)
editUser: async (userId: string, userData?: Partial<RegisterUserDTO>, currentUserRole?: string) => {
    if (!userData || !currentUserRole) {
        // Cette fonction ne devrait pas utiliser Swal.fire directement car elle peut être appelée côté serveur
        return { 
            error: 'Données utilisateur ou rôle manquants', 
            status: 400 
        } as ErrorResponse;
    }
    
    return await UserService.updateUser(userId, userData, currentUserRole);
},

// Supprimer un utilisateur
deleteUser: async (id: string, currentUser: User | null, users?: UserWithId[], setUsers?: (users: UserWithId[]) => void) => {
    try {
        if (!currentUser) {
            return { 
                error: 'Utilisateur non authentifié', 
                status: 401 
            } as ErrorResponse;
        }

        // Cette partie est pour le frontend uniquement avec confirmation UI
        if (users && setUsers) {
            // Interface utilisateur: confirmation avant suppression (à exécuter côté client)
            const deleteResult = await UserService._performDeleteUser(id, currentUser);
            
            if ('success' in deleteResult && deleteResult.success) {
                // Mise à jour de l'état local
                setUsers(users.filter(user => user.id !== id));

                // Swal uniquement côté client
                Swal.fire({
                    title: 'Supprimé!',
                    text: 'L\'utilisateur a été supprimé.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                // Swal uniquement côté client
                Swal.fire({
                    title: 'Erreur!',
                    text: 'error' in deleteResult ? deleteResult.error : 'Erreur lors de la suppression',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            return deleteResult;
        } else {
            // Appel direct sans UI (utilisé côté serveur)
            return await UserService._performDeleteUser(id, currentUser);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
        return { 
            error: 'Erreur lors de la suppression de l\'utilisateur', 
            status: 500 
        } as ErrorResponse;
    }
},

  // Méthode interne pour effectuer la suppression côté serveur
_performDeleteUser: async (id: string, currentUser: User | null) => {
    try {
        // Vérifier si l'utilisateur courant a le rôle ADMIN
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return {
                error: 'Seuls les administrateurs peuvent supprimer des utilisateurs',
                status: 403,
            } as ErrorResponse;
        }

        // Vérifier si l'utilisateur à supprimer existe
        const userToDelete = await prisma.user.findUnique({
            where: { id },
        });

        if (!userToDelete) {
            return { error: 'Utilisateur non trouvé', status: 404 } as ErrorResponse;
        }

        // Empêcher la suppression de son propre compte
        if (userToDelete.email === currentUser.email) {
            return {
                error: 'Vous ne pouvez pas supprimer votre propre compte',
                status: 400,
            } as ErrorResponse;
        }

        // Supprimer d'abord les sessions associées à cet utilisateur
        await prisma.session.deleteMany({
            where: { userId: id },
        });

        // supprime les booking associé au user
        await prisma.booking.deleteMany({
            where: { userId: id },
        })
        // supprime les transactions associé au user
        await prisma.transaction.deleteMany({
            where: { userId: id },
        })
        // supprime les tillbalance au user
        await prisma.tillbalance.deleteMany({
            where: { userId: id },
        })
        await prisma.userPreferences.deleteMany({
            where: { userId: id },
        })
        await prisma.activityLog.deleteMany({
            where: { userId: id },
        })
        await prisma.passengerList.deleteMany({
            where: { userId: id },
        })
        // Supprimer l'utilisateur après avoir supprimé les sessions
        await prisma.user.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
        return { 
            error: 'Erreur lors de la suppression de l\'utilisateur', 
            status: 500 
        } as ErrorResponse;
    }
},
    // Obtenir les rôles disponibles en fonction du rôle de l'utilisateur actuel
    getAvailableRoles: (currentUserRole: string): string[] => {
        if (currentUserRole === 'ADMIN') {
            return ['ADMIN', 'OPERATEUR', 'CAISSIER', 'CONTROLLER', 'USER'];
        } else if (currentUserRole === 'OPERATEUR') {
            return ['CAISSIER', 'CONTROLLER'];
        }
        return [];
    },

        // Ajouter un utilisateur (frontend + backend via authService)
        addUser: async (userData: RegisterUserDTO, users: UserWithId[], setUsers: (users: UserWithId[]) => void): Promise<boolean> => {
            try {
                const result = await authService.register(userData);
                
                if ('success' in result && result.success && 'user' in result) {
                    // Utiliser l'ID généré par Prisma
                    const newUser: UserWithId = {
                        ...userData,
                        id: result.user.id,
                        password: '', // Ne pas stocker le mot de passe en clair côté client
                    };
                    
                    setUsers([...users, newUser]);
                    
                    Swal.fire({
                        title: 'Succès!',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    
                    return true;
                } else {
                    throw new Error('code' in result ? result.message : 'Erreur lors de l\'inscription');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Erreur!',
                    text: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout de l\'utilisateur',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return false;
            }
        },
    
};