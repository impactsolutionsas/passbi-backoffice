'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { OperatorStatus, TransportType } from '@prisma/client';
import { OperatorWithId, OperatorDTO } from '../types/typeOperator';
import { useOperator } from '../hooks/useOperator'; // Importation du hook

interface OperatorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (operatorData: OperatorDTO, logoFile?: File) => Promise<boolean>;
    operatorToEdit?: OperatorWithId;
    readOnly?: boolean;
}

const OperatorFormModal: React.FC<OperatorFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    operatorToEdit,
    readOnly = false
}) => {
    // Utiliser le hook useOperator pour accéder aux données et fonctionnalités
    const {
        countries,
        lines,
        loading: hookLoading
    } = useOperator();

    const [formData, setFormData] = useState<OperatorDTO>({
        name: '',
        legalName: '',
        email: '',
        phone: '',
        countryId: '',
        ticketValidity: '',
        logoUrl: '',
        status: OperatorStatus.ACTIVE,
        transportType: TransportType.BUS,
        isUrbainStatus: false,
        estClasse: false,
        commissionOperator: 0,
        commissionPassenger: 0,
        lineId: ''
    });

    const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Remplir le formulaire avec les données de l'opérateur à modifier
    useEffect(() => {
        if (operatorToEdit) {
            setFormData({
                name: operatorToEdit.name || '',
                legalName: operatorToEdit.legalName || '',
                email: operatorToEdit.email || '',
                phone: operatorToEdit.phone || '',
                countryId: operatorToEdit.countryId || '',
                ticketValidity: operatorToEdit.ticketValidity || '',
                logoUrl: operatorToEdit.logoUrl || '',
                status: operatorToEdit.status || OperatorStatus.ACTIVE,
                transportType: operatorToEdit.transportType || TransportType.BUS,
                isUrbainStatus: operatorToEdit.isUrbainStatus || false,
                estClasse: operatorToEdit.estClasse || false,
                commissionOperator: operatorToEdit.commissionOperator || 0,
                commissionPassenger: operatorToEdit.commissionPassenger || 0,
                lineId: operatorToEdit.lineId || ''
            });

            if (operatorToEdit.logoUrl) {
                setPreviewUrl(operatorToEdit.logoUrl);
            }
        } else {
            // Réinitialiser le formulaire si nous ajoutons un nouvel opérateur
            setFormData({
                name: '',
                legalName: '',
                email: '',
                phone: '',
                countryId: '',
                ticketValidity: '',
                logoUrl: '',
                status: OperatorStatus.ACTIVE,
                transportType: TransportType.BUS,
                isUrbainStatus: false,
                estClasse: false,
                commissionOperator: 0,
                commissionPassenger: 0,
                lineId: ''
            });
            setPreviewUrl(null);
            setLogoFile(undefined);
        }
    }, [operatorToEdit]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checkbox.checked });
        } else if (type === 'number') {
            setFormData({ ...formData, [name]: parseFloat(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Le fichier est trop volumineux. La taille maximale est de 5MB.");
            return;
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            setError("Seuls les fichiers image sont acceptés.");
            return;
        }

        setLogoFile(file);

        // Créer une prévisualisation de l'image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (readOnly) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const success = await onSubmit(formData, logoFile);
            if (success) {
                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">
                        {operatorToEdit
                            ? (readOnly ? 'Détails de l\'opérateur' : 'Modifier l\'opérateur')
                            : 'Ajouter un nouvel opérateur'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Informations de base */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de l'opérateur *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dénomination légale
                                </label>
                                <input
                                    type="text"
                                    name="legalName"
                                    value={formData.legalName || ''}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pays *
                                </label>
                                <select
                                    name="countryId"
                                    value={formData.countryId}
                                    onChange={handleChange}
                                    required
                                    disabled={readOnly || hookLoading || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Sélectionner un pays</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ligne
                                </label>
                                <select
                                    name="lineId"
                                    value={formData.lineId || ''}
                                    onChange={handleChange}
                                    disabled={readOnly || hookLoading || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Sélectionner une ligne (optionnel)</option>
                                    {lines.map(line => (
                                        <option key={line.id} value={line.id}>
                                            {line.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Validité du ticket (en jours)
                                </label>
                                <input
                                    type="text"
                                    name="ticketValidity"
                                    value={formData.ticketValidity || ''}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                    placeholder="Ex: 30"
                                />
                            </div>
                        </div>

                        {/* Configuration et paramètres */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Statut
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                >
                                    {Object.values(OperatorStatus).map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type de transport
                                </label>
                                <select
                                    name="transportType"
                                    value={formData.transportType}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                >
                                    {Object.values(TransportType).map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isUrbainStatus"
                                    name="isUrbainStatus"
                                    checked={formData.isUrbainStatus}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <label htmlFor="isUrbainStatus" className="ml-2 text-sm text-gray-700">
                                    Opérateur urbain
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="estClasse"
                                    name="estClasse"
                                    checked={formData.estClasse}
                                    onChange={handleChange}
                                    disabled={readOnly || isSubmitting}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <label htmlFor="estClasse" className="ml-2 text-sm text-gray-700">
                                    Utilise un système de classes
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Opérateur (%)
                                </label>
                                <input
                                    type="number"
                                    name="commissionOperator"
                                    value={formData.commissionOperator || 0}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Passager (%)
                                </label>
                                <input
                                    type="number"
                                    name="commissionPassenger"
                                    value={formData.commissionPassenger || 0}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    disabled={readOnly || isSubmitting}
                                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo de l'opérateur
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        name="logo"
                                        onChange={handleFileChange}
                                        disabled={readOnly || isSubmitting}
                                        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                                        accept="image/*"
                                    />
                                    {previewUrl && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={previewUrl}
                                                alt="Logo prévisualisé"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                            disabled={readOnly || isSubmitting}
                        >
                            {isSubmitting ? 'Enregistrement...' : (operatorToEdit ? 'Mettre à jour' : 'Enregistrer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OperatorFormModal;