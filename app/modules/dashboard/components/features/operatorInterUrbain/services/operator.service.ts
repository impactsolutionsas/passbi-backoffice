import { CloudinaryService } from '@/app/core/services/cloudinary/cloudinaryService';
import { prisma } from '@/app/lib/database/prisma';
import { OperatorDTO, ErrorResponse } from '../types/typeOperator';

export const OperatorService = {
    // Récupérer tous les opérateurs
    async getOperators() {
        try {
            const operators = await prisma.operator.findMany({
                include: {
                    country: true,
                    line: true
                }
            });

            // Formater la date de création si nécessaire
            return operators.map(operator => ({
                ...operator,
                createdAt: operator.createdAt ? operator.createdAt.toISOString() : undefined
            }));
        } catch (error) {
            console.error('Erreur dans OperatorService.getOperators:', error);
            throw error;
        }
    },

    // Récupérer un opérateur par ID
    async getOperatorById(id: string) {
        try {
            const operator = await prisma.operator.findUnique({
                where: { id },
                include: {
                    country: true,
                    line: true
                }
            });

            if (!operator) {
                return { error: 'Opérateur non trouvé', status: 404 } as ErrorResponse;
            }

            return operator;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'opérateur ${id}:`, error);
            throw new Error(`Erreur lors de la récupération de l'opérateur`);
        }
    },

    // Ajouter un nouvel opérateur
    async addOperator(operatorData: OperatorDTO, logoFile?: File) {
        try {
            // Gérer l'upload du logo sur Cloudinary si un fichier est fourni
            let logoUrl = operatorData.logoUrl;

            if (logoFile) {
                const uploadResult = await CloudinaryService.uploadFile(logoFile, 'operator-logos');
                if (uploadResult.secure_url) {
                    logoUrl = uploadResult.secure_url;
                }
            }

            // Créer l'opérateur dans la base de données
            const newOperator = await prisma.operator.create({
                data: {
                    name: operatorData.name,
                    legalName: operatorData.legalName,
                    email: operatorData.email,
                    phone: operatorData.phone,
                    countryId: operatorData.countryId,
                    ticketValidity: operatorData.ticketValidity,
                    logoUrl: logoUrl,
                    status: operatorData.status || 'ACTIVE',
                    transportType: operatorData.transportType || 'BUS',
                    isUrbainStatus: operatorData.isUrbainStatus || false,
                    estClasse: operatorData.estClasse || false,
                    commissionOperator: operatorData.commissionOperator,
                    commissionPassenger: operatorData.commissionPassenger,
                    commissionTotal: (operatorData.commissionOperator || 0) + (operatorData.commissionPassenger || 0),
                    lineId: operatorData.lineId
                },
                include: {
                    country: true,
                    line: true
                }
            });

            return {
                success: true,
                operator: newOperator,
                message: 'Opérateur ajouté avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'opérateur:', error);

            if (error instanceof Error) {
                return {
                    success: false,
                    error: error.message,
                    status: 500
                };
            }

            return {
                success: false,
                error: 'Erreur lors de l\'ajout de l\'opérateur',
                status: 500
            };
        }
    },

    // Mettre à jour un opérateur
    async updateOperator(id: string, operatorData: Partial<OperatorDTO>, logoFile?: File) {
        try {
            // Vérifier si l'opérateur existe
            const existingOperator = await prisma.operator.findUnique({
                where: { id }
            });

            if (!existingOperator) {
                return { error: 'Opérateur non trouvé', status: 404 } as ErrorResponse;
            }

            // Gérer l'upload du logo sur Cloudinary si un fichier est fourni
            let logoUrl = operatorData.logoUrl;

            if (logoFile) {
                // Si un logo existe déjà, supprimez-le
                if (existingOperator.logoUrl) {
                    await CloudinaryService.deleteFile(existingOperator.logoUrl);
                }
                
                const uploadResult = await CloudinaryService.uploadFile(logoFile, 'operator-logos');
                if (uploadResult.secure_url) {
                    logoUrl = uploadResult.secure_url;
                }
            }

            // Calculer la commission totale si l'une des commissions est modifiée
            let commissionTotal = existingOperator.commissionTotal;

            if (operatorData.commissionOperator !== undefined || operatorData.commissionPassenger !== undefined) {
                const commissionOperator = operatorData.commissionOperator !== undefined
                    ? operatorData.commissionOperator
                    : existingOperator.commissionOperator || 0;

                const commissionPassenger = operatorData.commissionPassenger !== undefined
                    ? operatorData.commissionPassenger
                    : existingOperator.commissionPassenger || 0;

                commissionTotal = commissionOperator + commissionPassenger;
            }

            // Mettre à jour l'opérateur dans la base de données
            const updatedOperator = await prisma.operator.update({
                where: { id },
                data: {
                    ...operatorData,
                    logoUrl: logoUrl !== undefined ? logoUrl : existingOperator.logoUrl,
                    commissionTotal
                },
                include: {
                    country: true,
                    line: true
                }
            });

            return {
                success: true,
                operator: updatedOperator,
                message: 'Opérateur mis à jour avec succès'
            };
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'opérateur ${id}:`, error);

            return {
                success: false,
                error: 'Erreur lors de la mise à jour de l\'opérateur',
                status: 500
            };
        }
    },

    // Supprimer un opérateur
    async deleteOperator(id: string) {
        try {
            // Vérifier si l'opérateur existe
            const existingOperator = await prisma.operator.findUnique({
                where: { id }
            });

            if (!existingOperator) {
                return { error: 'Opérateur non trouvé', status: 404 } as ErrorResponse;
            }

            // Supprimer l'image du logo de Cloudinary si elle existe
            if (existingOperator.logoUrl) {
                await CloudinaryService.deleteFile(existingOperator.logoUrl);
            }

            // Suppression des relations associées
            // Remarque : Assurez-vous que les suppressions en cascade sont configurées correctement dans votre schéma Prisma

            // Supprimer l'opérateur
            await prisma.operator.delete({
                where: { id }
            });

            return {
                success: true,
                message: 'Opérateur supprimé avec succès'
            };
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'opérateur ${id}:`, error);

            return {
                success: false,
                error: 'Erreur lors de la suppression de l\'opérateur',
                status: 500
            };
        }
    },

    // Récupérer les pays disponibles
    async getCountries() {
        try {
            const countries = await prisma.country.findMany({
                orderBy: {
                    name: 'asc'
                }
            });

            return countries;
        } catch (error) {
            console.error('Erreur lors de la récupération des pays:', error);
            throw error;
        }
    },

    // Récupérer les lignes disponibles
    async getLines() {
        try {
            const lines = await prisma.line.findMany({
                orderBy: {
                    name: 'asc'
                }
            });

            return lines;
        } catch (error) {
            console.error('Erreur lors de la récupération des lignes:', error);
            throw error;
        }
    }
};