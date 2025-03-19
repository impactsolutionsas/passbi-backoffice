'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/app/modules/auth/hooks/useAuth';
import { changePasswordSchema, ChangePasswordFormData } from '@/app/modules/auth/utils/auth.validation';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const { changePassword, loading, error, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSuccess(null);
    const result = await changePassword(data);
    if (result && 'success' in result) {
      setSuccess(result.message);
      form.reset();
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-blue-100 flex items-center justify-center rounded-full">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Changement de mot de passe</h1>
          <p className="text-gray-600 mt-1">
            Bienvenue ! Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded">
            {success}
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
            <div className="relative">
              <input
                {...form.register("currentPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe actuel"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
                {showPassword ? (
                  <EyeOff onClick={toggleShowPassword} className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye onClick={toggleShowPassword} className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <div className="relative">
              <input
                {...form.register("newPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
                {showPassword ? (
                  <EyeOff onClick={toggleShowPassword} className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye onClick={toggleShowPassword} className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.newPassword.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <input
                {...form.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre nouveau mot de passe"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
                {showConfirmPassword ? (
                  <EyeOff onClick={toggleShowConfirmPassword} className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye onClick={toggleShowConfirmPassword} className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            {loading ? (
              <span className="mr-2">Chargement...</span>
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Changer le mot de passe
          </button>
        </form>
        
        <div className="mt-4 text-right">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}





// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import Link from 'next/link';
// import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';

// // Schéma de validation Zod
// const changePasswordSchema = z.object({
//   currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
//   newPassword: z
//     .string()
//     .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
//     .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
//     .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
//     .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
//     .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
//   confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise'),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//   message: 'Les mots de passe ne correspondent pas',
//   path: ['confirmPassword'],
// });

// // Type pour les données du formulaire
// type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// // Hook personnalisé d'authentification (simulation)
// const useAuth = () => {
//   const [user, setUser] = useState<any>({ role: 'CAISSIER' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [requirePasswordChange, setRequirePasswordChange] = useState(true);

//   const changePassword = async (currentPassword: string, newPassword: string) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Simuler un appel API
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Vérification simulée du mot de passe actuel
//       if (currentPassword === 'wrongpassword') {
//         setError('Le mot de passe actuel est incorrect');
//         setLoading(false);
//         return { success: false };
//       }
      
//       // Simuler le succès
//       setRequirePasswordChange(false);
//       setLoading(false);
//       return { success: true, message: 'Mot de passe modifié avec succès' };
//     } catch (err) {
//       setError('Une erreur est survenue lors du changement de mot de passe');
//       setLoading(false);
//       return { success: false };
//     }
//   };

//   return { user, loading, error, changePassword, requirePasswordChange };
// };

// export default function ChangePasswordPage() {
//   const { user, loading, error, changePassword, requirePasswordChange } = useAuth();
//   const router = useRouter();
//   const [success, setSuccess] = useState<string | null>(null);
  
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
  
//   const [passwordStrength, setPasswordStrength] = useState({
//     score: 0,
//     message: ''
//   });

//   // Utilisation de react-hook-form avec zod
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors, isSubmitting }
//   } = useForm<ChangePasswordFormData>({
//     resolver: zodResolver(changePasswordSchema),
//     defaultValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     }
//   });
  
//   // Surveiller la valeur du nouveau mot de passe pour calculer sa force
//   const newPassword = watch('newPassword');
  
//   // Rediriger si l'utilisateur n'est pas authentifié
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/auth/login');
//     }
    
//     // Rediriger si l'utilisateur n'a pas besoin de changer son mot de passe
//     if (!loading && user && !requirePasswordChange && 
//         !['CAISSIER', 'VENDEUR', 'CONTROLLER', 'OPERATEUR'].includes(user.role)) {
//       router.push('/modules/dashboard');
//     }
//   }, [loading, user, requirePasswordChange, router]);
  
//   // Calculer la force du mot de passe lorsqu'il change
//   useEffect(() => {
//     if (newPassword) {
//       checkPasswordStrength(newPassword);
//     } else {
//       setPasswordStrength({ score: 0, message: '' });
//     }
//   }, [newPassword]);
  
//   const checkPasswordStrength = (password: string) => {
//     // Règles de validation
//     const hasMinLength = password.length >= 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumbers = /\d/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
//     // Calculer le score
//     let score = 0;
//     if (hasMinLength) score++;
//     if (hasUpperCase) score++;
//     if (hasLowerCase) score++;
//     if (hasNumbers) score++;
//     if (hasSpecialChar) score++;
    
//     // Définir le message en fonction du score
//     let message = '';
//     if (score === 0) message = 'Très faible';
//     else if (score === 1) message = 'Faible';
//     else if (score === 2) message = 'Moyen';
//     else if (score === 3) message = 'Bon';
//     else if (score === 4) message = 'Fort';
//     else message = 'Très fort';
    
//     setPasswordStrength({ score, message });
//   };
  
//   const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
//     setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
//   };
  
//   const onSubmit = async (data: ChangePasswordFormData) => {
//     setSuccess(null);
    
//     // Vérifier que le mot de passe est suffisamment fort
//     if (passwordStrength.score < 3) {
//       return;
//     }

//     const result = await changePassword(data.currentPassword, data.newPassword);
    
//     if (result && result.success) {
//       setSuccess('Mot de passe modifié avec succès');
//       reset();
//     }
//   };
  
//   // Afficher le composant de chargement
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="h-14 w-14 bg-blue-100 flex items-center justify-center rounded-full">
//               <Shield className="h-7 w-7 text-blue-600" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800">Changement de mot de passe</h1>
//           <p className="mt-2 text-gray-600">
//             Pour votre sécurité, veuillez modifier votre mot de passe temporaire avant de continuer.
//           </p>
//         </div>
        
//         {error && (
//           <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
//             <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}
        
//         {success && (
//           <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
//             <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//             <p className="text-green-700">{success}</p>
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="space-y-4">
//             {/* Mot de passe actuel */}
//             <div>
//               <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Mot de passe actuel
//               </label>
//               <div className="relative">
//                 <input
//                   id="currentPassword"
//                   {...register('currentPassword')}
//                   type={showPassword.current ? "text" : "password"}
//                   className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none pl-10 ${
//                     errors.currentPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
//                   }`}
//                   placeholder="Entrez votre mot de passe actuel"
//                 />
//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('current')}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//               {errors.currentPassword && (
//                 <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
//               )}
//             </div>
            
//             {/* Nouveau mot de passe */}
//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   id="newPassword"
//                   {...register('newPassword')}
//                   type={showPassword.new ? "text" : "password"}
//                   className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none pl-10 ${
//                     errors.newPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
//                   }`}
//                   placeholder="Créez un nouveau mot de passe"
//                 />
//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('new')}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
              
//               {/* Indicateur de force du mot de passe */}
//               {newPassword && (
//                 <div className="mt-2">
//                   <div className="flex items-center justify-between mb-1">
//                     <span className="text-xs font-medium text-gray-700">Force du mot de passe:</span>
//                     <span className={`text-xs font-medium ${
//                       passwordStrength.score < 2 ? 'text-red-500' : 
//                       passwordStrength.score < 4 ? 'text-yellow-500' : 'text-green-500'
//                     }`}>
//                       {passwordStrength.message}
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div 
//                       className={`h-1.5 rounded-full ${
//                         passwordStrength.score < 2 ? 'bg-red-500' : 
//                         passwordStrength.score < 4 ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               )}
              
//               {errors.newPassword && (
//                 <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
//               )}
//             </div>
            
//             {/* Confirmation du mot de passe */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   id="confirmPassword"
//                   {...register('confirmPassword')}
//                   type={showPassword.confirm ? "text" : "password"}
//                   className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none pl-10 ${
//                     errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
//                   }`}
//                   placeholder="Confirmez votre nouveau mot de passe"
//                 />
//                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//                 <button
//                   type="button"
//                   onClick={() => togglePasswordVisibility('confirm')}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//               )}
              
//               {/* Afficher un message de validation si les mots de passe correspondent */}
//               {watch('confirmPassword') && watch('newPassword') === watch('confirmPassword') && (
//                 <div className="flex items-center mt-1 text-green-600">
//                   <CheckCircle className="w-4 h-4 mr-1" />
//                   <span className="text-xs">Les mots de passe correspondent</span>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
//                 isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
//               }`}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Chargement...
//                 </div>
//               ) : (
//                 'Mettre à jour le mot de passe'
//               )}
//             </button>
//           </div>
//         </form>
        
//         <div className="text-center pt-4 flex justify-between items-center">
//           <p className="text-sm text-gray-600">
//             Besoin d'aide? Contactez votre administrateur système
//           </p>
//           <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
//             Se connecter
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }