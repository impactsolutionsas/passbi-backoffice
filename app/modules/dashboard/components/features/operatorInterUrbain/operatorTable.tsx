'use client';

import React, { useState } from 'react';
import { Edit, Trash, Eye } from 'lucide-react';
import { OperatorWithId, OperatorDTO } from './types/typeOperator';
import OperatorFormModal from './modal/operatorFormModal';

interface OperatorTableProps {
    operators: OperatorWithId[];
    onEditOperator: (operatorId: string, operatorData: Partial<OperatorDTO>) => Promise<boolean>;
    onDeleteOperator: (operatorId: string) => Promise<boolean>;
}

const OperatorTable: React.FC<OperatorTableProps> = ({ operators, onEditOperator, onDeleteOperator }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [operatorToEdit, setOperatorToEdit] = useState<OperatorWithId | null>(null);

    // Gestionnaire pour ouvrir le modal de modification
    const handleEditClick = (operatorId: string) => {
        const operator = operators.find(o => o.id === operatorId);
        if (operator) {
            setOperatorToEdit(operator);
            setIsEditModalOpen(true);
        }
    };

    // Gestionnaire pour ouvrir le modal de visualisation
    const handleViewClick = (operatorId: string) => {
        const operator = operators.find(o => o.id === operatorId);
        if (operator) {
            setOperatorToEdit(operator);
            setIsViewModalOpen(true);
        }
    };

    // Gestionnaire pour fermer les modals
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setOperatorToEdit(null);
    };

    // Fonction pour obtenir la couleur de statut
    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'INACTIVE':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Fonction pour obtenir la couleur du type de transport
    const getTransportTypeColor = (type: string | undefined) => {
        switch (type) {
            case 'BUS':
                return 'bg-blue-100 text-blue-800';
            case 'TRAIN':
                return 'bg-purple-100 text-purple-800';
            case 'BOAT':  // Changed from FERRY to BOAT to match type definition
                return 'bg-cyan-100 text-cyan-800';
            case 'PLANE':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {operators.length > 0 ? (
                            operators.map((operator) => (
                                <tr key={operator.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                                {operator.logoUrl ? (
                                                    <img src={operator.logoUrl} alt={operator.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-blue-500 font-medium">{operator.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{operator.name}</div>
                                                <div className="text-sm text-gray-500">{operator.legalName || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{operator.email}</div>
                                        <div className="text-sm text-gray-500">{operator.phone || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransportTypeColor(operator.transportType)}`}>
                                            {operator.transportType || 'N/A'}
                                        </span>
                                        {operator.isUrbainStatus && (
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Urbain
                                            </span>
                                        )}
                                        {operator.estClasse && (
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                Avec classes
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(operator.status)}`}>
                                            {operator.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {operator.createdAt ? new Date(operator.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            onClick={() => handleViewClick(operator.id)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                            onClick={() => handleEditClick(operator.id)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => onDeleteOperator(operator.id)}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Aucun opérateur trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de modification */}
            {isEditModalOpen && operatorToEdit && (
                <OperatorFormModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    operatorToEdit={operatorToEdit}
                    onSubmit={async (operatorData) => {
                        const success = await onEditOperator(operatorToEdit.id, operatorData);
                        if (success) handleCloseModal();
                        return success;
                    }}
                />
            )}

            {/* Modal de visualisation (lecture seule) */}
            {isViewModalOpen && operatorToEdit && (
                <OperatorFormModal
                    isOpen={isViewModalOpen}
                    onClose={handleCloseModal}
                    operatorToEdit={operatorToEdit}
                    readOnly={true}
                    onSubmit={async () => {
                        handleCloseModal();
                        return true;
                    }}
                />
            )}
        </>
    );
};

export default OperatorTable;