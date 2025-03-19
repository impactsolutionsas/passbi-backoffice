'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Vehicle, Trip, Stats, DashboardContextType } from '../types';

const defaultStats: Stats = {
    utilisateurs: { total: 97, augmentation: '5%' },
    vehicules: { total: 42, augmentation: '12%' },
    trajets: { total: 156, augmentation: '7%' },
    nouveauxUtilisateurs: { total: 24, augmentation: '15%' }
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('accueil');
    const [users, setUsers] = useState<User[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [stats] = useState<Stats>(defaultStats);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserForm, setShowUserForm] = useState(false);
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [showTripForm, setShowTripForm] = useState(false);

    // Simuler le chargement des données
    useEffect(() => {
        // Données utilisateurs simulées
        setUsers([
            { id: '1', name: 'Mohamed Diallo', email: 'mohamed@example.com', role: 'Conducteur', createdAt: '2025-02-15' },
            { id: '2', name: 'Fatou Diop', email: 'fatou@example.com', role: 'Opérateur', createdAt: '2025-02-18' },
            { id: '3', name: 'Amadou Sow', email: 'amadou@example.com', role: 'Contrôleur', createdAt: '2025-02-20' },
            { id: '4', name: 'Aïcha Ndiaye', email: 'aicha@example.com', role: 'Caissier', createdAt: '2025-03-01' },
            { id: '5', name: 'Omar Bah', email: 'omar@example.com', role: 'Admin', createdAt: '2025-03-05' }
        ]);

        // Données véhicules simulées
        setVehicles([
            { id: '1', immatriculation: 'DK-1234-AB', marque: 'Toyota', modele: 'Hiace', capacite: 18, status: 'disponible' },
            { id: '2', immatriculation: 'DK-5678-CD', marque: 'Mercedes', modele: 'Sprinter', capacite: 22, status: 'en service' },
            { id: '3', immatriculation: 'DK-9012-EF', marque: 'Renault', modele: 'Master', capacite: 15, status: 'maintenance' }
        ]);

        // Données trajets simulées
        setTrips([
            { id: '1', depart: 'Dakar', destination: 'Saint-Louis', date: '2025-03-15', vehiculeId: '1', chauffeurId: '1', status: 'planifié' },
            { id: '2', depart: 'Thiès', destination: 'Mbour', date: '2025-03-16', vehiculeId: '2', chauffeurId: '1', status: 'en cours' },
            { id: '3', depart: 'Dakar', destination: 'Touba', date: '2025-03-14', vehiculeId: '3', chauffeurId: '2', status: 'terminé' }
        ]);
    }, []);

    return (
        <DashboardContext.Provider value={{
            activeTab,
            setActiveTab,
            users,
            vehicles,
            trips,
            stats,
            searchTerm,
            setSearchTerm,
            showUserForm,
            setShowUserForm,
            showVehicleForm,
            setShowVehicleForm,
            showTripForm,
            setShowTripForm
        }}>
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