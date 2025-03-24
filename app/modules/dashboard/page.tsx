
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import useAuth from '../auth/hooks/useAuth';

// // Icônes et composants
// import {
//     Users, Car, Map, Home, Settings, LogOut,
//     Bell, Search, ChevronDown, Plus, Edit, Trash,
//     Menu, X, ChevronRight, ChevronLeft
// } from 'lucide-react';

// // Types
// type User = {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     createdAt: string;
// };

// type Vehicle = {
//     id: string;
//     immatriculation: string;
//     marque: string;
//     modele: string;
//     capacite: number;
//     status: 'disponible' | 'en service' | 'maintenance';
// };

// type Trip = {
//     id: string;
//     depart: string;
//     destination: string;
//     date: string;
//     vehiculeId: string;
//     chauffeurId: string;
//     status: 'planifié' | 'en cours' | 'terminé' | 'annulé';
// };

// const Dashboard: React.FC = () => {
//     const { user, logout, isAuthenticated } = useAuth();
//     const router = useRouter();
//     const [activeTab, setActiveTab] = useState('accueil');
//     const [users, setUsers] = useState<User[]>([]);
//     const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//     const [trips, setTrips] = useState<Trip[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showUserForm, setShowUserForm] = useState(false);
//     const [showVehicleForm, setShowVehicleForm] = useState(false);
//     const [showTripForm, setShowTripForm] = useState(false);
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     // Statistiques pour le tableau de bord
//     const stats = {
//         utilisateurs: { total: 97, augmentation: '5%' },
//         vehicules: { total: 42, augmentation: '12%' },
//         trajets: { total: 156, augmentation: '7%' },
//         nouveauxUtilisateurs: { total: 24, augmentation: '15%' }
//     };

//     // Vérifier l'authentification au chargement
//     // useEffect(() => {
//     //     if (!isAuthenticated) {
//     //         router.push('/auth/login');
//     //     }

//     //     // Simuler le chargement des données
//     //     fetchMockData();
//     // }, [isAuthenticated, router]);

//     // Simuler le chargement des données (à remplacer par des appels API réels)
//     const fetchMockData = () => {
//         // Données utilisateurs simulées
//         setUsers([
//             { id: '1', name: 'Mohamed Diallo', email: 'mohamed@example.com', role: 'Conducteur', createdAt: '2025-02-15' },
//             { id: '2', name: 'Fatou Diop', email: 'fatou@example.com', role: 'Opérateur', createdAt: '2025-02-18' },
//             { id: '3', name: 'Amadou Sow', email: 'amadou@example.com', role: 'Contrôleur', createdAt: '2025-02-20' },
//             { id: '4', name: 'Aïcha Ndiaye', email: 'aicha@example.com', role: 'Caissier', createdAt: '2025-03-01' },
//             { id: '5', name: 'Omar Bah', email: 'omar@example.com', role: 'Admin', createdAt: '2025-03-05' }
//         ]);

//         // Données véhicules simulées
//         setVehicles([
//             { id: '1', immatriculation: 'DK-1234-AB', marque: 'Toyota', modele: 'Hiace', capacite: 18, status: 'disponible' },
//             { id: '2', immatriculation: 'DK-5678-CD', marque: 'Mercedes', modele: 'Sprinter', capacite: 22, status: 'en service' },
//             { id: '3', immatriculation: 'DK-9012-EF', marque: 'Renault', modele: 'Master', capacite: 15, status: 'maintenance' }
//         ]);

//         // Données trajets simulées
//         setTrips([
//             { id: '1', depart: 'Dakar', destination: 'Saint-Louis', date: '2025-03-15', vehiculeId: '1', chauffeurId: '1', status: 'planifié' },
//             { id: '2', depart: 'Thiès', destination: 'Mbour', date: '2025-03-16', vehiculeId: '2', chauffeurId: '1', status: 'en cours' },
//             { id: '3', depart: 'Dakar', destination: 'Touba', date: '2025-03-14', vehiculeId: '3', chauffeurId: '2', status: 'terminé' }
//         ]);
//     };

//     // Utiliser useEffect pour charger les données au montage du composant
//     useEffect(() => {
//         fetchMockData();
//     }, []);

//     // Filtrer les données en fonction du terme de recherche
//     const filteredUsers = users.filter(user =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredVehicles = vehicles.filter(vehicle =>
//         vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredTrips = trips.filter(trip =>
//         trip.depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // Gérer la déconnexion
//     const handleLogout = () => {
//         logout();
//     };

//     // Toggle le menu mobile
//     const toggleMobileMenu = () => {
//         setMobileMenuOpen(!mobileMenuOpen);
//     };

//     // Toggle la sidebar
//     const toggleSidebar = () => {
//         setSidebarCollapsed(!sidebarCollapsed);
//     };

//     // Composant de statistiques
//     const StatCard = ({ title, value, increase, icon }: { title: string, value: number, increase: string, icon: React.ReactNode }) => (
//         <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-gray-500 text-sm">{title}</p>
//                     <h3 className="font-bold text-2xl mt-1">{value}</h3>
//                     <p className="text-xs mt-1">
//                         <span className={`${increase.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
//                             {increase}
//                         </span> depuis le mois dernier
//                     </p>
//                 </div>
//                 <div className="bg-blue-50 p-3 rounded-full">
//                     {icon}
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="flex h-screen bg-gray-50">
//             {/* Sidebar - version desktop */}
//             <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white hidden md:block transition-all duration-300 ease-in-out`}>
//                 <div className={`p-4 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
//                     {!sidebarCollapsed && <h1 className="font-bold text-xl">PassBi Admin</h1>}
//                     <button 
//                         className="text-white p-1 rounded-full hover:bg-gray-800 transition-all"
//                         onClick={toggleSidebar}
//                     >
//                         {sidebarCollapsed ? 
//                             <ChevronRight size={20} /> : 
//                             <ChevronLeft size={20} />
//                         }
//                     </button>
//                 </div>
//                 <nav className="mt-6">
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'accueil' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => setActiveTab('accueil')}
//                     >
//                         <Home size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Tableau de bord</span>}
//                     </div>
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => setActiveTab('utilisateurs')}
//                     >
//                         <Users size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Gestion Utilisateurs</span>}
//                     </div>
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'vehicules' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => setActiveTab('vehicules')}
//                     >
//                         <Car size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Gestion Véhicules</span>}
//                     </div>
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'trajets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => setActiveTab('trajets')}
//                     >
//                         <Map size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Gestion Trajets</span>}
//                     </div>
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer ${activeTab === 'parametres' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => setActiveTab('parametres')}
//                     >
//                         <Settings size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Paramètres</span>}
//                     </div>
//                     <div
//                         className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 cursor-pointer hover:bg-gray-800 mt-12`}
//                         onClick={handleLogout}
//                     >
//                         <LogOut size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                         {!sidebarCollapsed && <span>Déconnexion</span>}
//                     </div>
//                 </nav>
//             </div>

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
//                         onClick={() => {
//                             setActiveTab('accueil');
//                             toggleMobileMenu();
//                         }}
//                     >
//                         <Home size={20} className="mr-3" />
//                         <span>Tableau de bord</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'utilisateurs' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => {
//                             setActiveTab('utilisateurs');
//                             toggleMobileMenu();
//                         }}
//                     >
//                         <Users size={20} className="mr-3" />
//                         <span>Gestion Utilisateurs</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'vehicules' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => {
//                             setActiveTab('vehicules');
//                             toggleMobileMenu();
//                         }}
//                     >
//                         <Car size={20} className="mr-3" />
//                         <span>Gestion Véhicules</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'trajets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => {
//                             setActiveTab('trajets');
//                             toggleMobileMenu();
//                         }}
//                     >
//                         <Map size={20} className="mr-3" />
//                         <span>Gestion Trajets</span>
//                     </div>
//                     <div
//                         className={`flex items-center px-4 py-3 cursor-pointer ${activeTab === 'parametres' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
//                         onClick={() => {
//                             setActiveTab('parametres');
//                             toggleMobileMenu();
//                         }}
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

//             {/* Main Content */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 {/* Top Navigation */}
//                 <header className="bg-white shadow-sm">
//                     <div className="flex items-center justify-between p-4">
//                         <div className="flex items-center">
//                             {/* Menu button for mobile */}
//                             <button
//                                 className="mr-4 md:hidden text-gray-600"
//                                 onClick={toggleMobileMenu}
//                             >
//                                 <Menu size={24} />
//                             </button>
                            
//                             <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-96">
//                                 <Search size={18} className="text-gray-500 mr-2" />
//                                 <input
//                                     type="text"
//                                     placeholder="Rechercher..."
//                                     className="bg-transparent border-none focus:outline-none w-full"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <button className="relative">
//                                 <Bell size={20} />
//                                 <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">3</span>
//                             </button>
//                             <div className="hidden sm:flex items-center">
//                                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
//                                     {user?.name?.charAt(0) || 'U'}
//                                 </div>
//                                 <span className="mr-1 hidden sm:inline">{user?.name || 'Utilisateur'}</span>
//                                 <ChevronDown size={16} className="hidden sm:inline" />
//                             </div>
//                         </div>
//                     </div>
//                 </header>
                
//                 {/* Main Content Area */}
//                 <main className="flex-1 overflow-y-auto p-4">
//                     {/* Dashboard Content */}
//                     {activeTab === 'accueil' && (
//                         <div>
//                             <h2 className="text-2xl font-semibold mb-6">Tableau de Bord</h2>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                                 <StatCard
//                                     title="Utilisateurs"
//                                     value={stats.utilisateurs.total}
//                                     increase={stats.utilisateurs.augmentation}
//                                     icon={<Users size={24} className="text-blue-500" />}
//                                 />
//                                 <StatCard
//                                     title="Véhicules"
//                                     value={stats.vehicules.total}
//                                     increase={stats.vehicules.augmentation}
//                                     icon={<Car size={24} className="text-green-500" />}
//                                 />
//                                 <StatCard
//                                     title="Trajets"
//                                     value={stats.trajets.total}
//                                     increase={stats.trajets.augmentation}
//                                     icon={<Map size={24} className="text-purple-500" />}
//                                 />
//                                 <StatCard
//                                     title="Nouveaux utilisateurs"
//                                     value={stats.nouveauxUtilisateurs.total}
//                                     increase={stats.nouveauxUtilisateurs.augmentation}
//                                     icon={<Users size={24} className="text-orange-500" />}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Users Management */}
//                     {activeTab === 'utilisateurs' && (
//                         <div>
//                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                                 <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Gestion des Utilisateurs</h2>
//                                 <button 
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center sm:justify-start"
//                                     onClick={() => setShowUserForm(true)}
//                                 >
//                                     <Plus size={16} className="mr-2" />
//                                     Ajouter un utilisateur
//                                 </button>
//                             </div>
//                             <div className="bg-white rounded-lg shadow overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredUsers.map((user) => (
//                                             <tr key={user.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                                             <span className="text-blue-500 font-medium">{user.name.charAt(0)}</span>
//                                                         </div>
//                                                         <div className="ml-4">
//                                                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm text-gray-900">{user.email}</div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                                         {user.role}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     {user.createdAt}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <button className="text-blue-600 hover:text-blue-900 mr-3">
//                                                         <Edit size={16} />
//                                                     </button>
//                                                     <button className="text-red-600 hover:text-red-900">
//                                                         <Trash size={16} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     {/* Vehicles Management */}
//                     {activeTab === 'vehicules' && (
//                         <div>
//                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                                 <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Gestion des Véhicules</h2>
//                                 <button 
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center sm:justify-start"
//                                     onClick={() => setShowVehicleForm(true)}
//                                 >
//                                     <Plus size={16} className="mr-2" />
//                                     Ajouter un véhicule
//                                 </button>
//                             </div>
//                             <div className="bg-white rounded-lg shadow overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque/Modèle</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredVehicles.map((vehicle) => (
//                                             <tr key={vehicle.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                     {vehicle.immatriculation}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm font-medium text-gray-900">{vehicle.marque}</div>
//                                                     <div className="text-sm text-gray-500">{vehicle.modele}</div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     {vehicle.capacite} places
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                         ${vehicle.status === 'disponible' ? 'bg-green-100 text-green-800' : 
//                                                         vehicle.status === 'en service' ? 'bg-blue-100 text-blue-800' : 
//                                                         'bg-yellow-100 text-yellow-800'}`}>
//                                                         {vehicle.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <button className="text-blue-600 hover:text-blue-900 mr-3">
//                                                         <Edit size={16} />
//                                                     </button>
//                                                     <button className="text-red-600 hover:text-red-900">
//                                                         <Trash size={16} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     {/* Trips Management */}
//                     {activeTab === 'trajets' && (
//                         <div>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-2xl font-semibold">Gestion des Trajets</h2>
//                                 <button 
//                                     className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                                     onClick={() => setShowTripForm(true)}
//                                 >
//                                     <Plus size={16} className="mr-2" />
//                                     Ajouter un trajet
//                                 </button>
//                             </div>
//                             <div className="bg-white rounded-lg shadow overflow-hidden">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ - Destination</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredTrips.map((trip) => (
//                                             <tr key={trip.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm font-medium text-gray-900">{trip.depart}</div>
//                                                     <div className="text-sm text-gray-500">→ {trip.destination}</div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     {trip.date}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                                                         ${trip.status === 'planifié' ? 'bg-blue-100 text-blue-800' : 
//                                                         trip.status === 'en cours' ? 'bg-yellow-100 text-yellow-800' : 
//                                                         trip.status === 'terminé' ? 'bg-green-100 text-green-800' : 
//                                                         'bg-red-100 text-red-800'}`}>
//                                                         {trip.status}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <button className="text-blue-600 hover:text-blue-900 mr-3">
//                                                         <Edit size={16} />
//                                                     </button>
//                                                     <button className="text-red-600 hover:text-red-900">
//                                                         <Trash size={16} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}

//                     {/* Settings */}
//                     {activeTab === 'parametres' && (
//                         <div>
//                             <h2 className="text-2xl font-semibold mb-6">Paramètres du Système</h2>
//                             <div className="bg-white rounded-lg shadow p-6">
//                                 <h3 className="text-lg font-medium mb-4">Paramètres généraux</h3>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Nom de l'application
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                                             defaultValue="PassBi Admin"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Email de contact
//                                         </label>
//                                         <input
//                                             type="email"
//                                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                                             defaultValue="contact@passbi.sn"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Langue par défaut
//                                         </label>
//                                         <select className="w-full border border-gray-300 rounded-md px-3 py-2">
//                                             <option value="fr">Français</option>
//                                             <option value="en">Anglais</option>
//                                             <option value="wo">Wolof</option>
//                                         </select>
//                                     </div>
//                                     <div className="pt-4">
//                                         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//                                             Enregistrer les modifications
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };


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
        const immatMatch = vehicle.immatriculation && vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());
        const marqueMatch = vehicle.marque && vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase());
        return immatMatch || marqueMatch;
      });
      
      const filteredTrips = trips.filter(trip => {
        const departMatch = trip.depart && trip.depart.toLowerCase().includes(searchTerm.toLowerCase());
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
                return <UsersPanel users={filteredUsers} />;
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