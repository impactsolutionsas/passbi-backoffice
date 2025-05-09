import { OperatorStatus, TransportType } from '@prisma/client';

// Interface pour la création et mise à jour d'un opérateur
export interface OperatorDTO {
    name: string;
    legalName?: string;
    email: string;
    phone?: string;
    countryId: string;
    ticketValidity?: string;
    logoUrl?: string;
    status?: OperatorStatus;
    transportType?: TransportType;
    isUrbainStatus?: boolean;
    estClasse?: boolean;
    commissionOperator?: number;
    commissionPassenger?: number;
    lineId?: string;
}

// Interface pour étendre OperatorDTO avec l'id
export interface OperatorWithId extends OperatorDTO {
    id: string;
    createdAt?: string;
    commissionTotal?: number;
    country?: {
        id: string;
        name: string;
        code: string;
    };
    line?: {
        id: string;
        name: string;
    };
}

// Interface pour la réponse d'erreur
export interface ErrorResponse {
    error: string;
    status?: number;
}

// Interface pour la pagination
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Interface pour le filtrage
export interface FilterDropdownProps {
    statuses: OperatorStatus[];
    selectedStatus: OperatorStatus | '';
    onStatusChange: (status: OperatorStatus | '') => void;
    transportTypes: TransportType[];
    selectedTransportType: TransportType | '';
    onTransportTypeChange: (type: TransportType | '') => void;
}

// Interface pour le tableau des opérateurs
export interface OperatorTableProps {
    operators: OperatorWithId[];
    onEdit: (operatorId: string, operatorData?: Partial<OperatorDTO>) => void;
    onDelete: (operatorId: string) => Promise<boolean>;
}

// Interface pour le panneau des opérateurs
export interface OperatorsPanelProps {
    currentUserRole: string;
}

// Interface pour le formulaire d'ajout/modification d'opérateur
export interface OperatorFormProps {
    operator?: OperatorWithId;
    countries: any[];
    lines: any[];
    isEditing: boolean;
    onSubmit: (data: OperatorDTO, logoFile?: File) => Promise<boolean>;
    onCancel: () => void;
}