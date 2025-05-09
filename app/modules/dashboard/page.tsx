'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../auth/hooks/useAuth';
// Components
import Sidebar from './components/layout/Sidebar';
import MobileSidebar from './components/layout/MobileSidebar';
import TopNavigation from './components/layout/TopNavigation';
// Features
import HomePanel from './components/features/home/HomePanel';
import UsersPanel from './components/features/users/UsersPanel';
import VehiclesPanel from './components/features/vehicles/VehiclesPanel';
import TripsPanel from './components/features/trips/TripsPanel';
import SettingsPanel from './components/settings/SettingsForm';
import OperatorPanel from './components/features/operatorInterUrbain/operatorPanel';
// Context
import { DashboardProvider, useDashboard } from './contexts/DashboardContext';

const DashboardContent = () => {
    const { 
        activeTab, 
        users, 
        vehicles, 
        trips, 
        stats, 
        searchTerm, 
        setSearchTerm 
    } = useDashboard();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Gérer la déconnexion
    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };
    
    // Toggle le menu mobile
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    // Filtrer les données en fonction du terme de recherche
    const filteredUsers = users.filter(user => {
        const nameMatch = user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
      });
      
      const filteredVehicles = vehicles.filter(vehicle => {
        const immatMatch = vehicle.registrationNumber && vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
        // const marqueMatch = vehicle.modele && vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase());
        return immatMatch ;
      });
      
      const filteredTrips = trips.filter(trip => {
        const departMatch = trip.departure && trip.departure.toLowerCase().includes(searchTerm.toLowerCase());
        const destinationMatch = trip.destination && trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
        return departMatch || destinationMatch;
      });
    
    // Composant pour afficher une page d'erreur
    const ErrorPage = () => (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page non trouvée</h2>
                <p className="text-gray-600 mb-6">
                    La section que vous recherchez n'existe pas ou n'est pas disponible pour le moment.
                </p>
                <button 
                    onClick={() => setActiveTab('accueil')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Retour au tableau de bord
                </button>
            </div>
        </div>
    );
    
    // Fonction pour afficher le contenu en fonction de l'onglet actif
    const renderContent = () => {
        switch (activeTab) {
            case 'accueil':
                return <HomePanel stats={stats} />;
            case 'utilisateurs':
                return <UsersPanel currentUserRole={user?.role || "USER"} />;
            // case 'operateurInterUrbain':
            //     return <OperatorPanel operators={filteredUsers} />;
            case 'operateurInterUrbain':
                return <OperatorPanel />;
            case 'vehicules':
                return <VehiclesPanel vehicles={filteredVehicles} />;
            case 'trajets':
                return <TripsPanel trips={filteredTrips} />;
            case 'parametres':
                return <SettingsPanel />;
            default:
                return <ErrorPage />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar pour desktop */}
            <Sidebar 
                handleLogout={handleLogout} 
            />
            
            {/* Contenu principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <TopNavigation 
                    user={user} 
                    toggleMobileMenu={toggleMobileMenu} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                
                {/* Sidebar mobile */}
                <MobileSidebar 
                    isOpen={mobileMenuOpen} 
                    onClose={toggleMobileMenu} 
                    handleLogout={handleLogout}
                    activeTab={activeTab}
                    // setActiveTab={setActiveTab}
                />
                
                {/* Contenu principal */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    );
};

export default Dashboard;