// 'use client';

// import React from 'react';
// import { Users, Car, Map, Home, Settings, LogOut, X } from 'lucide-react';
// import { useDashboard } from '../../contexts/DashboardContext';

// type MobileSidebarProps = {
//     mobileMenuOpen: boolean;
//     toggleMobileMenu: () => void;
//     handleLogout: () => void;
// };

// const MobileSidebar: React.FC<MobileSidebarProps> = ({ mobileMenuOpen, toggleMobileMenu, handleLogout }) => {
//     const { activeTab, setActiveTab } = useDashboard();

//     const handleItemClick = (tab: string) => {
//         setActiveTab(tab);
//         toggleMobileMenu();
//     };

//     return (
//         <>
//             {/* Mobile menu overlay */}
//             {mobileMenuOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
//             )}

//             {/* Mobile sidebar */}
//             <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
//                 <div className="p-4 flex justify-between items-center">
//                     <h1 className="font-bold text-xl">PassBi Admin</h1>
//                     <button onClick={toggleMobileMenu} className="text-white">
//                         <X size={24} />
//                     </button>
//                 </div>
//                 <nav className="mt-6">
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'accueil' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => handleItemClick('accueil')}
//                     >
//                         <Home size={20} className="mr-3" />
//                         <span>Tableau de bord</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => handleItemClick('utilisateurs')}
//                     >
//                         <Users size={20} className="mr-3" />
//                         <span>Gestion Utilisateurs</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'vehicules' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => handleItemClick('vehicules')}
//                     >
//                         <Car size={20} className="mr-3" />
//                         <span>Gestion Véhicules</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'trajets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => handleItemClick('trajets')}
//                     >
//                         <Map size={20} className="mr-3" />
//                         <span>Gestion Trajets</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'parametres' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => handleItemClick('parametres')}
//                     >
//                         <Settings size={20} className="mr-3" />
//                         <span>Paramètres</span>
//                     </div>
//                     <div
//                         className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 mt-12"
//                         onClick={handleLogout}
//                     >
//                         <LogOut size={20} className="mr-3" />
//                         <span>Déconnexion</span>
//                     </div>
//                 </nav>
//             </div>
//         </>
//     );
// };

// export default MobileSidebar;

'use client';

import React, { useState } from 'react';
import { Users, Car, Map, Home, Settings, LogOut, X, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

type MobileSidebarProps = {
    mobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    handleLogout: () => void;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ mobileMenuOpen, toggleMobileMenu, handleLogout }) => {
    const { activeTab, setActiveTab } = useDashboard();
    const [interUrbainOpen, setInterUrbainOpen] = useState(false);
    const [urbainOpen, setUrbainOpen] = useState(false);

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

                    {/* Menu déroulant Opérateur inter urbain */}
                    <div>
                        <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800"
                            onClick={() => setInterUrbainOpen(!interUrbainOpen)}
                        >
                            <Car size={20} className="mr-3" />
                            <span>Opérateur inter urbain</span>
                            {interUrbainOpen ? <ChevronUp size={20} className="ml-auto" /> : <ChevronDown size={20} className="ml-auto" />}
                        </div>
                        {interUrbainOpen && (
                            <div className="pl-8">
                                <div
                                    className={`py-2 cursor-pointer hover:bg-gray-800 ${activeTab === 'gestion-vehicules' ? 'bg-blue-600' : ''}`}
                                    onClick={() => handleItemClick('gestion-vehicules')}
                                >
                                    Gestion Véhicules
                                </div>
                                <div
                                    className={`py-2 cursor-pointer hover:bg-gray-800 ${activeTab === 'gestion-trajets' ? 'bg-blue-600' : ''}`}
                                    onClick={() => handleItemClick('gestion-trajets')}
                                >
                                    Gestion Trajets
                                </div>
                                <div
                                    className={`py-2 cursor-pointer hover:bg-gray-800 ${activeTab === 'ajout-operateur' ? 'bg-blue-600' : ''}`}
                                    onClick={() => handleItemClick('ajout-operateur')}
                                >
                                    Ajout Opérateur
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu déroulant Opérateur urbain */}
                    <div>
                        <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800"
                            onClick={() => setUrbainOpen(!urbainOpen)}
                        >
                            <Map size={20} className="mr-3" />
                            <span>Opérateur urbain</span>
                            {urbainOpen ? <ChevronUp size={20} className="ml-auto" /> : <ChevronDown size={20} className="ml-auto" />}
                        </div>
                        {urbainOpen && (
                            <div className="pl-8">
                                <div
                                    className={`py-2 cursor-pointer hover:bg-gray-800 ${activeTab === 'gestion-operateur' ? 'bg-blue-600' : ''}`}
                                    onClick={() => handleItemClick('gestion-operateur')}
                                >
                                    Gestion Opérateur
                                </div>
                                <div
                                    className={`py-2 cursor-pointer hover:bg-gray-800 ${activeTab === 'line-zone-station' ? 'bg-blue-600' : ''}`}
                                    onClick={() => handleItemClick('line-zone-station')}
                                >
                                    Line Zone Station
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu Gestion Tickets */}
                    <div
                        className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'gestion-tickets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                        onClick={() => handleItemClick('gestion-tickets')}
                    >
                        <Ticket size={20} className="mr-3" />
                        <span>Gestion Tickets</span>
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