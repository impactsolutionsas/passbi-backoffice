import { Trip, Vehicle, Operator } from "@prisma/client";
import { UserWithId } from "../../types";

export type Stats = {
    utilisateurs: { total: number, augmentation: string };
    vehicules: { total: number, augmentation: string };
    trajets: { total: number, augmentation: string };
    nouveauxUtilisateurs: { total: number, augmentation: string };
};

export type DashboardContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    users: UserWithId[];
    setUsers: React.Dispatch<React.SetStateAction<UserWithId[]>>;
    vehicles: Vehicle[]; // Utilisation du type Vehicle de Prisma
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
    trips: Trip[]; // Utilisation du type Trip de Prisma
    setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
    stats: Stats;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showUserForm: boolean;
    setShowUserForm: (show: boolean) => void;
    showVehicleForm: boolean;
    setShowVehicleForm: (show: boolean) => void;
    showTripForm: boolean;
    setShowTripForm: (show: boolean) => void;
    operators?: Operator[]; // Ajout des opérateurs (optionnel)
};