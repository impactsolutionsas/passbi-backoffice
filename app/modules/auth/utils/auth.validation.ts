import { z } from 'zod';
import { PieceType, Role } from '@prisma/client';

// Schéma de validation pour l'enregistrement
export const registerSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string().default("Passer123").optional(),
  confirmPassword: z.string().default("Passer123").optional(),
  idNumber: z.string().min(1, { message: "Le numéro d'identification est obligatoire" }),
  pieceType: z.nativeEnum(PieceType, { 
    errorMap: () => ({ message: "Veuillez sélectionner un type de pièce valide" })
  }),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" })
  }),
  photoUrl: z.string().url({ message: "URL de photo invalide" }).optional(),
}).refine(data => {
  // Si les deux champs sont fournis, on vérifie qu'ils correspondent
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  // Sinon, c'est valide (car on utilise la valeur par défaut)
  return true;
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});
// Schéma pour la mise à jour d'un utilisateur (tous les champs sont optionnels)
export const updateUserSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit comporter au moins 2 caractères' }).optional(),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Rôle non valide' }),
  }).optional(),
  password: z.string().min(6, { message: 'Le mot de passe doit comporter au moins 6 caractères' }).optional(),
  pieceType: z.nativeEnum(PieceType, {
    errorMap: () => ({ message: 'Type de pièce non valide' }),
  }).optional(),
  idNumber: z.string().optional(),
  photoUrl: z.string().url({ message: 'URL de photo invalide' }).optional(),
  isFirstLogin: z.boolean().optional(),
});
// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string().min(1, { message: "Veuillez entrer votre mot de passe" }),
});


// Schéma pour le changement de mot de passe
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est obligatoire'),
  newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'La confirmation du mot de passe est obligatoire'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Type pour les données d'enregistrement validées
export type RegisterFormData = z.infer<typeof registerSchema>;

// Type pour les données de connexion validées
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
