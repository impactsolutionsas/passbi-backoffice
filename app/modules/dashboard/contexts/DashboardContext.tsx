'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Vehicle, Trip, Stats, DashboardContextType, UserWithId as TypedUserWithId } from '../types';
import { useUser } from '../components/features/users/hooks/useUser';

const defaultStats: Stats = {
    utilisateurs: { total: 0, augmentation: '0%' },
    vehicules: { total: 0, augmentation: '0%' },
    trajets: { total: 0, augmentation: '0%' },
    nouveauxUtilisateurs: { total: 0, augmentation: '0%' }
};

// Contexte avec les propriétés nécessaires (sans redéfinir UserWithId)
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('accueil');
    const { users, setUsers, fetchUsers } = useUser();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [stats, setStats] = useState<Stats>(defaultStats);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserForm, setShowUserForm] = useState(false);
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [showTripForm, setShowTripForm] = useState(false);

    // Charger les données initiales
    useEffect(() => {
        fetchUsers();
        
        // Chargez vos données à partir d'une API ici pour les véhicules et les trajets
        // Exemple: fetchVehicles().then(data => setVehicles(data));
    }, [fetchUsers]);

    // Mettre à jour les statistiques en fonction des données
    useEffect(() => {
        setStats({
            utilisateurs: { 
                total: users.length, 
                augmentation: users.length > 0 ? '5%' : '0%' 
            },
            vehicules: { 
                total: vehicles.length, 
                augmentation: vehicles.length > 0 ? '12%' : '0%' 
            },
            trajets: { 
                total: trips.length, 
                augmentation: trips.length > 0 ? '7%' : '0%' 
            },
            nouveauxUtilisateurs: { 
                total: Math.floor(users.length * 0.25), 
                augmentation: users.length > 0 ? '15%' : '0%' 
            }
        });
    }, [users, vehicles, trips]);

    // Valeur du contexte
    const contextValue: DashboardContextType = {
        activeTab,
        setActiveTab,
        users,
        setUsers,
        vehicles,
        setVehicles,
        trips,
        setTrips,
        stats,
        searchTerm,
        setSearchTerm,
        showUserForm,
        setShowUserForm,
        showVehicleForm,
        setShowVehicleForm,
        showTripForm,
        setShowTripForm
    };
    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};