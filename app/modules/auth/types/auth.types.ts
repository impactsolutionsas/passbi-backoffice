import { Role, User, PieceType } from '@prisma/client';

export type AuthUser = Omit<User, 'password'>;

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  idNumber: string;
  pieceType: "CNI" | "PASSPORT";
  role: "CONTROLLER" | "CAISSIER" | "USER" | "OPERATEUR" | "ADMIN";
  photoUrl?: string;
  otpId?: string;
}
export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  isFirstLogin: boolean;
}

export interface AuthError {
  message: string;
  code: string;
}