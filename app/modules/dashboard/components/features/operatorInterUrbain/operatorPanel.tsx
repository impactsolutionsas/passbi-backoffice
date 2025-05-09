"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useOperator } from "./hooks/useOperator";
import Pagination from "../../Pagination/Pagination";
import FilterDropdown from "../../filter/FilterDropdown";
import { useRouter } from "next/navigation";
import OperatorTable from "./operatorTable";
import OperatorFormModal from "./modal/operatorFormModal";

const OperatorPanel: React.FC = () => {
    const {
        operators,
        addOperator,
        deleteOperator,
        editOperator,
        loading,
        error,
        fetchOperators,
    } = useOperator();

    const [showOperatorForm, setShowOperatorForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Tous");
    const [selectedTransportType, setSelectedTransportType] = useState("Tous");
    const itemsPerPage = 5;
    const router = useRouter();

    // Vérifier l'authentification et rediriger si nécessaire
    useEffect(() => {
        if (error && error.includes("Non authentifié")) {
            router.push("/auth/login");
        }
    }, [error, router]);

    // Récupérer les opérateurs lors du montage du composant
    useEffect(() => {
        fetchOperators();
    }, [fetchOperators]);

    // Filtrer les opérateurs basés sur le terme de recherche et les filtres sélectionnés
    const filteredOperators = operators.filter((operator) => {
        const matchesSearch =
            operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (operator.email &&
                operator.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (operator.phone &&
                operator.phone.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            selectedStatus === "Tous" || operator.status === selectedStatus;

        const matchesTransportType =
            selectedTransportType === "Tous" ||
            operator.transportType === selectedTransportType;

        return matchesSearch && matchesStatus && matchesTransportType;
    });

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

    // Déterminer les opérateurs à afficher sur la page actuelle
    const paginatedOperators = filteredOperators.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Extraire les statuts uniques pour le filtre
    const uniqueStatuses = [
        "Tous",
        ...Array.from(new Set(operators.map((operator) => operator.status))),
    ];

    // Extraire les types de transport uniques pour le filtre
    const uniqueTransportTypes = [
        "Tous",
        ...Array.from(
            new Set(operators.map((operator) => operator.transportType))
        ),
    ];

    return (
        <div className="space-y-6">
            {loading && (
                <div className="text-center py-4">
                    <p>Chargement des opérateurs...</p>
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
                <h2 className="text-2xl font-semibold">Gestion des Opérateurs</h2>

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

                    {/* <FilterDropdown
                        options={uniqueStatuses}
                        selectedOption={selectedStatus}
                        onOptionChange={setSelectedStatus}
                        label="Statut"
                    />

                    <FilterDropdown
                        options={uniqueTransportTypes}
                        selectedOption={selectedTransportType}
                        onOptionChange={setSelectedTransportType}
                        label="Type de transport"
                    /> */}

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                        onClick={() => setShowOperatorForm(true)}
                    >
                        <Plus size={16} className="mr-2" />
                        Ajouter un opérateur
                    </button>
                </div>
            </div>

            {/* Tableau des opérateurs */}
            <OperatorTable
                operators={paginatedOperators}
                onEditOperator={editOperator}
                onDeleteOperator={deleteOperator}
            />

            {/* Pagination */}
            {filteredOperators.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Modal pour l'ajout d'opérateur */}
            <OperatorFormModal
                isOpen={showOperatorForm}
                onClose={() => setShowOperatorForm(false)}
                onSubmit={async (operatorData) => {
                    const success = await addOperator(operatorData);
                    if (success) setShowOperatorForm(false);
                    return success;
                }}
            />
        </div>
    );
};

export default OperatorPanel;