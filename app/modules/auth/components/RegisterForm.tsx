'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '../utils/auth.validation';
import useAuth from '../hooks/useAuth';
import Link from 'next/link';
import { PieceType, Role } from '@prisma/client';

export const RegisterForm: React.FC = () => {
  const { register, loading, error } = useAuth();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const { 
    register: registerField,
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: 'Passer123',
      confirmPassword: 'Passer123'
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmissionError(null);
    try {
      console.log("Données du formulaire soumises:", data);
      const result = await register(data);
      console.log("Résultat de l'inscription:", result);
      if (!result) {
        setSubmissionError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setSubmissionError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
      
      {(error || submissionError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error || submissionError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Entrez votre nom"
            {...registerField('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Entrez votre email"
            {...registerField('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        {/* Champs password et confirmPassword cachés avec valeurs par défaut */}
        <input type="hidden" {...registerField('password')} />
        <input type="hidden" {...registerField('confirmPassword')} />

        <div className="mb-4">
          <label htmlFor="pieceType" className="block text-sm font-medium mb-1">
            Type de pièce d'identité
          </label>
          <select
            id="pieceType"
            className={`w-full p-2 border rounded ${errors.pieceType ? 'border-red-500' : 'border-gray-300'}`}
            {...registerField('pieceType')}
          >
            <option value="">Sélectionnez un type</option>
            <option value={PieceType.CNI}>Carte Nationale d'Identité</option>
            <option value={PieceType.PASSPORT}>Passeport</option>
          </select>
          {errors.pieceType && (
            <p className="mt-1 text-xs text-red-500">{errors.pieceType.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="idNumber" className="block text-sm font-medium mb-1">
            Numéro d'identification
          </label>
          <input
            id="idNumber"
            type="text"
            className={`w-full p-2 border rounded ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Entrez votre numéro d'identification"
            {...registerField('idNumber')}
          />
          {errors.idNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.idNumber.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Rôle
          </label>
          <select
            id="role"
            className={`w-full p-2 border rounded ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
            {...registerField('role')}
          >
            <option value="">Sélectionnez un rôle</option>
            <option value={Role.USER}>Utilisateur</option>
            <option value={Role.CONTROLLER}>Contrôleur</option>
            <option value={Role.CAISSIER}>Caissier</option>
            <option value={Role.OPERATEUR}>Opérateur</option>
            <option value={Role.ADMIN}>Administrateur</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div className="p-3 mb-4 bg-blue-50 text-blue-800 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Un mot de passe par défaut (Passer123) sera généré. 
            Vos identifiants de connexion vous seront envoyés à l'adresse email que vous avez fournie.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Vous avez déjà un compte?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
};