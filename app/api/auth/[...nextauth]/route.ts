import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/app/modules/auth/services/auth.service';
import { prisma } from '../../../lib/database/prisma';
import { Role } from '@prisma/client';

// Étendre le type User pour inclure le rôle
declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: Role;
    }
  }
}

// Étendre le type JWT pour inclure le rôle
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const authOptions: NextAuthOptions = {
  // Suppression de l'adaptateur
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // Appel au service d'authentification
        const result = await authService.login({
          email: credentials.email,
          password: credentials.password
        });
        
        // Vérifier si l'authentification a réussi
        if ('code' in result) {
          return null;
        }
        
        // Retourner l'utilisateur
        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Inclure le rôle et l'ID dans le token JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter le rôle et l'ID à la session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Créer le gestionnaire d'authentification
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };