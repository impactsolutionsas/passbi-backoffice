    'use client';

    import React, { useState } from 'react';
    import { Edit, Trash } from 'lucide-react';
    import { UserWithId } from './hooks/useUser';
    import UserFormModal from './modal/UserFormModal';

    interface UserTableProps {
        users: UserWithId[];
        onEditUser: (userId: string, userData: any) => Promise<boolean>; // Modifié pour retourner une promesse
        onDeleteUser: (userId: string) => Promise<boolean>;
    }

    const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onDeleteUser }) => {
        // Ajoutez un état pour suivre l'utilisateur à modifier et l'état du modal
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [userToEdit, setUserToEdit] = useState<UserWithId | null>(null);
        
        // Gestionnaire pour ouvrir le modal de modification
        const handleEditClick = (userId: string) => {
            const user = users.find(u => u.id === userId);
            if (user) {
                setUserToEdit(user);
                setIsEditModalOpen(true);
            }
        };
        
        // Gestionnaire pour fermer le modal
        const handleCloseModal = () => {
            setIsEditModalOpen(false);
            setUserToEdit(null);
        };
        return (
            <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-500 font-medium">{user.name.charAt(0)}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'OPERATEUR' ? 'bg-blue-100 text-blue-800' :
                                            user.role === 'CAISSIER' ? 'bg-green-100 text-green-800' :
                                            user.role === 'CONTROLLER' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                onClick={() => handleEditClick(user.id)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => onDeleteUser(user.id)}
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Aucun utilisateur trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

                        {/* Modal de modification */}
                        {isEditModalOpen && (
        <UserFormModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            userToEdit={userToEdit || undefined}
            onSubmit={async (userData) => {
                // Ici on peut utiliser la fonction onEditUser (qui doit être mise à jour)
                if (userToEdit) {
                    const success = await onEditUser(userToEdit.id, userData);
                    if (success) handleCloseModal();
                    return success;
                }
                return false;
            }}
        />
    )}

                        </>
        );
    };

    export default UserTable;