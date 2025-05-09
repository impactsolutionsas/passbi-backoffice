import { RegisterUserDTO } from "../../auth/types/auth.types";

// Étendre RegisterUserDTO pour inclure l'id obligatoire
export interface UserWithId extends RegisterUserDTO {
    id: string; // id obligatoire, pas optionnel
    createdAt?: string;
}
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    // searchTerm: string;
    onPageChange: (page: number) => void;
}

export interface FilterDropdownProps {
    roles: string[];
    selectedRole: string;
    onRoleChange: (role: string) => void;
}

interface UserTableProps {
    users: UserWithId[];
    onEditUser: (userId: string, userData?: Partial<RegisterUserDTO>) => void;
    onDeleteUser: (userId: string) => Promise<boolean>;
}

export interface UsersPanelProps {
    currentUserRole: string;
}

export type Vehicle = {
    id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    capacite: number;
    status: 'disponible' | 'en service' | 'maintenance';
};

export type Trip = {
    id: string;
    depart: string;
    destination: string;
    date: string;
    vehiculeId: string;
    chauffeurId: string;
    status: 'planifié' | 'en cours' | 'terminé' | 'annulé';
};

