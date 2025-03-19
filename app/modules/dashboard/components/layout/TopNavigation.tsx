'use client';

import React from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

type TopNavigationProps = {
    user: { name?: string } | null;
    toggleMobileMenu: () => void;
};

const TopNavigation: React.FC<TopNavigationProps> = ({ user, toggleMobileMenu }) => {
    const { searchTerm, setSearchTerm } = useDashboard();

    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    {/* Menu button for mobile */}
                    <button
                        className="mr-4 md:hidden text-gray-600"
                        onClick={toggleMobileMenu}
                    >
                        <Menu size={24} />
                    </button>
                    
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-96">
                        <Search size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="bg-transparent border-none focus:outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">3</span>
                    </button>
                    <div className="hidden sm:flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="mr-1 hidden sm:inline">{user?.name || 'Utilisateur'}</span>
                        <ChevronDown size={16} className="hidden sm:inline" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavigation;