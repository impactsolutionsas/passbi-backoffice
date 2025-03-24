'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { UserWithId, useUser } from '../hooks/useUser';
import { PieceType, Role } from '@prisma/client';
import { RegisterUserDTO } from '@/app/modules/auth/types/auth.types';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: RegisterUserDTO) => Promise<boolean>;
    availableRoles?: Role[];
    userToEdit?: UserWithId; // Prop pour l'utilisateur à modifier
}

const UserFormModal: React.FC<UserFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit,
    availableRoles = ['ADMIN', 'OPERATEUR', 'CONTROLLER'] as Role[],
    userToEdit
}) => {
    const { loading } = useUser();
    
    // Initialisez le formulaire avec les données de l'utilisateur à modifier s'il existe
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: (availableRoles && availableRoles.length > 0 ? availableRoles[0] : 'ADMIN') as Role,
        pieceType: 'CNI' as PieceType,
        idNumber: '',
        password: 'Passer123'
    });

    // Dans useEffect pour mettre à jour le formulaire si userToEdit change
    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name || '',
                email: userToEdit.email || '',
                role: userToEdit.role || (availableRoles && availableRoles.length > 0 ? availableRoles[0] : 'ADMIN') as Role,
                pieceType: userToEdit.pieceType || 'CNI' as PieceType,
                idNumber: userToEdit.idNumber || '',
                password: 'Passer123' // Gardez le mot de passe par défaut
            });
        } else {
            // Réinitialiser le formulaire si on passe en mode ajout
            setFormData({
                name: '',
                email: '',
                role: (availableRoles && availableRoles.length > 0 ? availableRoles[0] : 'ADMIN') as Role,
                pieceType: 'CNI' as PieceType,
                idNumber: '',
                password: 'Passer123'
            });
        }
    }, [userToEdit, availableRoles]);


    interface FormErrors {
        name?: string;
        email?: string;
        role?: string;
        pieceType?: string;
        idNumber?: string;
    }
    
    const [errors, setErrors] = useState<FormErrors>({});
    
    if (!isOpen) return null;
    
    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }
        
        if (!formData.role) {
            newErrors.role = 'Le rôle est requis';
        }
        
        if (!formData.pieceType) {
            newErrors.pieceType = 'Le type de pièce d\'identité est requis';
        }
        
        // Vérifier idNumber seulement lors de l'ajout d'un nouvel utilisateur
        if (!userToEdit && !formData.idNumber.trim()) {
            newErrors.idNumber = 'Le numéro d\'identité est requis';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'role') {
            // Assurez-vous que value est un Role valide
            const roleValue = value as Role;
            setFormData(prev => ({ ...prev, [name]: roleValue }));
        } 
        else if (name === 'pieceType') {
            // Assurez-vous que value est un PieceType valide
            const pieceTypeValue = value as PieceType;
            setFormData(prev => ({ ...prev, [name]: pieceTypeValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        // Effacer l'erreur pour ce champ si l'utilisateur le modifie
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                let userData: RegisterUserDTO = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role as Role,
                    pieceType: formData.pieceType as PieceType,
                    idNumber: formData.idNumber,
                    password: 'Passer123'
                };
                
                // Si on modifie un utilisateur, ne pas inclure le mot de passe
                if (userToEdit) {
                    // @ts-ignore - Nous savons que nous ne transmettons pas le mot de passe
                    delete userData.password;
                    // Conserver l'ancien numéro d'identité en mode édition
                    userData.idNumber = userToEdit.idNumber;
                }
                
                const success = await onSubmit(userData);
                
                if (success) {
                    onClose(); // Fermer le modal après soumission réussie
                }
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
            }
        }
    };
    
    // Changer le titre du modal en fonction du mode (ajout ou modification)
    const modalTitle = userToEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur";
    
    // Changer le texte du bouton en fonction du mode
    const buttonText = userToEdit ? "Mettre à jour" : "Ajouter";
    
    // IMPORTANT: Déboguer les valeurs pour voir si le modal reçoit les bonnes données
    console.log("UserToEdit:", userToEdit);
    console.log("Current formData:", formData);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">{modalTitle}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet*
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nom et prénom"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email*
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Rôle*
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                                errors.role ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            {(availableRoles && availableRoles.length > 0 ? availableRoles : ['ADMIN', 'OPERATEUR', 'CONTROLLER']).map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                    </div>
                    
                    <div className={`${userToEdit ? 'grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                        <div>
                            <label htmlFor="pieceType" className="block text-sm font-medium text-gray-700 mb-1">
                                Type de pièce*
                            </label>
                            <select
                                id="pieceType"
                                name="pieceType"
                                value={formData.pieceType}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                                    errors.pieceType ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="CNI">Carte d'identité nationale</option>
                                <option value="PASSPORT">Passeport</option>
                            </select>
                            {errors.pieceType && (
                                <p className="mt-1 text-sm text-red-600">{errors.pieceType}</p>
                            )}
                        </div>
                        
                        {/* Afficher le champ de numéro d'identité uniquement lors de l'ajout d'un nouvel utilisateur */}
                        {!userToEdit && (
                            <div>
                                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Numéro d'identité*
                                </label>
                                <input
                                    type="text"
                                    id="idNumber"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    placeholder="1234567890123"
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                                        errors.idNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.idNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-6 border-t pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Traitement...' : buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserFormModal;











// modification sa passe avec ce code 





// 'use client';

// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import { UserWithId } from '../hooks/useUser';
// import { RegisterUserDTO } from '@/app/modules/auth/types/auth.types';
// import { Role } from '@prisma/client';

// interface UserFormModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (userData: RegisterUserDTO) => Promise<boolean>;
//     userToEdit?: UserWithId;
//     availableRoles?: Role[];
// }

// const UserFormModal: React.FC<UserFormModalProps> = ({
//     isOpen,
//     onClose,
//     onSubmit,
//     userToEdit,
//     availableRoles = [],
// }) => {
//     // État local pour gérer les données du formulaire
//     const [formData, setFormData] = useState<RegisterUserDTO>({
//         name: '',
//         email: '',
//         password: '',
//         role: 'USER',
//     });
    
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
    
//     // Initialiser le formulaire avec les données de l'utilisateur à modifier
//     useEffect(() => {
//         if (userToEdit) {
//             setFormData({
//                 name: userToEdit.name || '',
//                 email: userToEdit.email || '',
//                 password: '', // Ne pas pré-remplir le mot de passe pour des raisons de sécurité
//                 role: userToEdit.role || 'USER',
//             });
//         } else {
//             // Réinitialiser le formulaire si aucun utilisateur n'est fourni pour édition
//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 role: 'USER',
//             });
//         }
//     }, [userToEdit]);
    
//     // Gérer les changements dans les champs du formulaire
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
    
//     // Gérer la soumission du formulaire
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setError(null);
        
//         try {
//             // Si nous modifions un utilisateur et que le mot de passe est vide, nous l'excluons
//             const dataToSubmit: RegisterUserDTO = {...formData};
            
//             if (userToEdit && !dataToSubmit.password) {
//                 // Si c'est une modification et que le mot de passe est vide, ne pas l'inclure
//                 const { password, ...restData } = dataToSubmit;
//                 await onSubmit(restData as RegisterUserDTO);
//             } else {
//                 // Sinon, soumettre toutes les données
//                 await onSubmit(dataToSubmit);
//             }
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Une erreur est survenue');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
    
//     if (!isOpen) return null;
    
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="relative bg-white rounded-lg w-full max-w-md mx-4">
//                 {/* En-tête du modal */}
//                 <div className="flex justify-between items-center border-b p-4">
//                     <h3 className="text-xl font-semibold">
//                         {userToEdit ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
//                     </h3>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
                
//                 {/* Corps du modal */}
//                 <div className="p-4">
//                     <form onSubmit={handleSubmit}>
//                         {error && (
//                             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                                 {error}
//                             </div>
//                         )}
                        
//                         {/* Champ nom */}
//                         <div className="mb-4">
//                             <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Nom
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                             />
//                         </div>
                        
//                         {/* Champ email */}
//                         <div className="mb-4">
//                             <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                                 required
//                             />
//                         </div>
                        
//                         {/* Champ mot de passe */}
//                         <div className="mb-4">
//                             <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
//                                 {userToEdit ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                                 required={!userToEdit} // Requis seulement pour la création
//                             />
//                         </div>
                        
//                         {/* Champ rôle */}
//                         {availableRoles && availableRoles.length > 0 && (
//                             <div className="mb-4">
//                                 <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
//                                     Rôle
//                                 </label>
//                                 <select
//                                     id="role"
//                                     name="role"
//                                     value={formData.role}
//                                     onChange={handleChange}
//                                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     {availableRoles.map((role) => (
//                                         <option key={role} value={role}>
//                                             {role}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}
                        
//                         {/* Boutons d'action */}
//                         <div className="flex justify-end mt-6">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//                                 disabled={isSubmitting}
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? 'Traitement...' : userToEdit ? 'Mettre à jour' : 'Ajouter'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserFormModal;