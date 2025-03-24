"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useDashboard } from "../../../contexts/DashboardContext";
import UserFormModal from "./modal/UserFormModal";
import UserTable from "./UserTable";
import { useUser } from "./hooks/useUser";
import Pagination from "../../Pagination/Pagination";
import FilterDropdown from "../../filter/FilterDropdown";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { RegisterUserDTO } from "@/app/modules/auth/types/auth.types";

interface UsersPanelProps {
  currentUserRole: string;
}

const UsersPanel: React.FC<UsersPanelProps> = ({ currentUserRole }) => {
  const { users, searchTerm, setSearchTerm } = useDashboard();
  const {
    addUser,
    deleteUser,
    editUser,
    getAvailableRoles,
    loading,
    error,
    currentUser,
    fetchUsers,
  } = useUser();
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("Tous");
  const itemsPerPage = 5;
  const router = useRouter();

  // Vérifier l'authentification et rediriger si nécessaire
  useEffect(() => {
    if (error && error.includes("Non authentifié")) {
      // Rediriger vers la page de connexion si non authentifié
      router.push("/auth/login");
    }
  }, [error, router]);

  // Ajouter cette logique pour récupérer les utilisateurs lors du montage du composant
  useEffect(() => {
    fetchUsers();
  }, [currentUser, fetchUsers]);

  // Filtrer les utilisateurs basés sur le terme de recherche et le rôle sélectionné
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === "Tous" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Déterminer les utilisateurs à afficher sur la page actuelle
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Extraire les rôles uniques pour le filtre
  const uniqueRoles = [
    "Tous",
    ...Array.from(new Set(users.map((user) => user.role))),
  ];

  // Fonction pour gérer la modification d'un utilisateur
  const handleEditUser = async (userId: string, userData: any) => {
    const success = await editUser(userId, userData);
    return success;
};

  // Cette fonction convertit les chaînes de caractères en type Role
  const mapAvailableRolesToEnum = (roles: string[]): Role[] => {
    return roles
      .filter(role => role !== "Tous") // Exclure "Tous" qui n'est pas un Role valide
      .map(role => role as Role);
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <p>Chargement des utilisateurs...</p>
        </div>
      )}

      {error && !error.includes("Non authentifié") && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erreur:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* En-tête avec bouton d'ajout et recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Utilisateurs</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <FilterDropdown
            roles={uniqueRoles}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            onClick={() => setShowUserForm(true)}
          >
            <Plus size={16} className="mr-2" />
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <UserTable
        users={paginatedUsers}
        onEditUser={handleEditUser}
        onDeleteUser={deleteUser}
      />

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal pour l'ajout d'utilisateur */}
      <UserFormModal
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSubmit={async (userData: RegisterUserDTO) => {
          const success = await addUser(userData);
          if (success) setShowUserForm(false);
          return success;
        }}
        availableRoles={mapAvailableRolesToEnum(getAvailableRoles(currentUserRole))}
      />
    </div>
  );
};

export default UsersPanel;