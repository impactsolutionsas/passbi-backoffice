export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

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

export type Stats = {
    utilisateurs: { total: number, augmentation: string };
    vehicules: { total: number, augmentation: string };
    trajets: { total: number, augmentation: string };
    nouveauxUtilisateurs: { total: number, augmentation: string };
};

export type DashboardContextType = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    users: User[];
    vehicles: Vehicle[];
    trips: Trip[];
    stats: Stats;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showUserForm: boolean;
    setShowUserForm: (show: boolean) => void;
    showVehicleForm: boolean;
    setShowVehicleForm: (show: boolean) => void;
    showTripForm: boolean;
    setShowTripForm: (show: boolean) => void;
};