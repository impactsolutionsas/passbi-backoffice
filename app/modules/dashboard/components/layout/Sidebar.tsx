'use client';

import React, { useState } from 'react';
import { Users, Car, Map, Home, Settings, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

type SidebarProps = {
    handleLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
    const { activeTab, setActiveTab } = useDashboard();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white hidden md:block transition-all duration-300 ease-in-out`}>
            <div className={`p-4 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                {!sidebarCollapsed && <h1 className="font-bold text-xl">PassBi Admin</h1>}
                <button 
                    className="text-white p-1 rounded-full hover:bg-gray-800 transition-all"
                    onClick={toggleSidebar}
                >
                    {sidebarCollapsed ? 
                        <ChevronRight size={20} /> : 
                        <ChevronLeft size={20} />
                    }
                </button>
            </div>
            <nav className="mt-6">
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'accueil' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                    onClick={() => setActiveTab('accueil')}
                >
                    <Home size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Tableau de bord</span>}
                </div>
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                    onClick={() => setActiveTab('utilisateurs')}
                >
                    <Users size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Gestion Utilisateurs</span>}
                </div>
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'vehicules' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                    onClick={() => setActiveTab('vehicules')}
                >
                    <Car size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Gestion Véhicules</span>}
                </div>
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'trajets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                    onClick={() => setActiveTab('trajets')}
                >
                    <Map size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Gestion Trajets</span>}
                </div>
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'parametres' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                    onClick={() => setActiveTab('parametres')}
                >
                    <Settings size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Paramètres</span>}
                </div>
                <div
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer hover:bg-gray-800 mt-12`}
                    onClick={handleLogout}
                >
                    <LogOut size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && <span>Déconnexion</span>}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;