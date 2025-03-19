'use client';

import React from 'react';
import { Users, Car, Map, Home, Settings, LogOut, X } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

type MobileSidebarProps = {
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    handleLogout: () => void;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ mobileMenuOpen, toggleMobileMenu, handleLogout }) => {
    const { activeTab, setActiveTab } = useDashboard();

    const handleItemClick = (tab: string) => {
        setActiveTab(tab);
        toggleMobileMenu();
    };

    return (
        <>
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className="p-4 flex justify-between items-center">
                    <h1 className="font-bold text-xl">PassBi Admin</h1>
                    <button onClick={toggleMobileMenu} className="text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-6">
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'accueil' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('accueil')}
                    >
                        <Home size={20} className="mr-3" />
                        <span>Tableau de bord</span>
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('utilisateurs')}
                    >
                        <Users size={20} className="mr-3" />
                        <span>Gestion Utilisateurs</span>
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'vehicules' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('vehicules')}
                    >
                        <Car size={20} className="mr-3" />
                        <span>Gestion Véhicules</span>
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'trajets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('trajets')}
                    >
                        <Map size={20} className="mr-3" />
                        <span>Gestion Trajets</span>
                    </div>
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'parametres' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('parametres')}
                    >
                        <Settings size={20} className="mr-3" />
                        <span>Paramètres</span>
                    </div>
                    <div
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 mt-12"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="mr-3" />
                        <span>Déconnexion</span>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default MobileSidebar;