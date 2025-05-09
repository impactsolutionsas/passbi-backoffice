"use client";
import { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { Operator, OperatorStatus, TransportType } from "@prisma/client";
import { OperatorDTO, OperatorWithId } from "../types/typeOperator";

export const useOperator = () => {
    const [operators, setOperators] = useState<OperatorWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [countries, setCountries] = useState<any[]>([]);
    const [lines, setLines] = useState<any[]>([]);

    // Récupérer tous les opérateurs
    const fetchOperators = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("auth-token")
                    : null;

            if (!token) {
                throw new Error("Non authentifié");
            }

            const response = await fetch("/api/operators", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                throw new Error("Non authentifié");
            } else if (response.status === 403) {
                throw new Error("Non autorisé");
            } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erreur lors du chargement des opérateurs"
                );
            }

            const data = await response.json();
            setOperators(data);
            return data;
        } catch (err) {
            console.error("Erreur de chargement:", err);
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer les pays
    const fetchCountries = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("auth-token")
                    : null;

            if (!token) {
                throw new Error("Non authentifié");
            }

            const response = await fetch("/api/countries", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erreur lors du chargement des pays"
                );
            }

            const data = await response.json();
            setCountries(data);
            return data;
        } catch (err) {
            console.error("Erreur de chargement des pays:", err);
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer les lignes
    const fetchLines = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("auth-token")
                    : null;

            if (!token) {
                throw new Error("Non authentifié");
            }

            const response = await fetch("/api/lines", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erreur lors du chargement des lignes"
                );
            }

            const data = await response.json();
            setLines(data);
            return data;
        } catch (err) {
            console.error("Erreur de chargement des lignes:", err);
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialisation: charger les données nécessaires
    useEffect(() => {
        const initialize = async () => {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("auth-token")
                    : null;

            if (!token) {
                console.log(
                    "Aucun token trouvé lors de l'initialisation, authentification requise"
                );
                return;
            }

            await fetchOperators();
            await fetchCountries();
            await fetchLines();
        };

        initialize();
    }, [fetchOperators, fetchCountries, fetchLines]);

    // Ajouter un opérateur
    const addOperator = useCallback(
        async (operatorData: OperatorDTO, logoFile?: File): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const token =
                    typeof window !== "undefined"
                        ? localStorage.getItem("auth-token")
                        : null;

                if (!token) {
                    throw new Error("Non authentifié");
                }

                // Création d'un FormData pour gérer l'upload de fichier
                const formData = new FormData();
                formData.append("operatorData", JSON.stringify(operatorData));

                if (logoFile) {
                    formData.append("logo", logoFile);
                }

                const response = await fetch("/api/operators", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Ne pas définir Content-Type car FormData le fait automatiquement
                    },
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Erreur lors de l'ajout de l'opérateur"
                    );
                }

                if (result.success && result.operator) {
                    setOperators((prev) => [...prev, result.operator]);

                    Swal.fire({
                        title: "Succès!",
                        text: result.message || "Opérateur ajouté avec succès",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    return true;
                }

                return false;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Une erreur est survenue"
                );

                Swal.fire({
                    title: "Erreur!",
                    text:
                        err instanceof Error
                            ? err.message
                            : "Une erreur est survenue lors de l'ajout de l'opérateur",
                    icon: "error",
                    confirmButtonText: "OK",
                });

                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Modifier un opérateur
    const editOperator = useCallback(
        async (
            operatorId: string,
            operatorData: Partial<OperatorDTO>,
            logoFile?: File
        ): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const token =
                    typeof window !== "undefined"
                        ? localStorage.getItem("auth-token")
                        : null;

                if (!token) {
                    throw new Error("Non authentifié");
                }

                // Création d'un FormData pour gérer l'upload de fichier
                const formData = new FormData();
                formData.append("operatorData", JSON.stringify(operatorData));

                if (logoFile) {
                    formData.append("logo", logoFile);
                }

                const response = await fetch(`/api/operators/${operatorId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Erreur lors de la mise à jour de l'opérateur"
                    );
                }

                if (result.success && result.operator) {
                    // Mettre à jour l'état local
                    setOperators((prev) =>
                        prev.map((op) => (op.id === operatorId ? result.operator : op))
                    );

                    Swal.fire({
                        title: "Succès!",
                        text: "Opérateur mis à jour avec succès",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    return true;
                }

                return false;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Une erreur est survenue"
                );

                Swal.fire({
                    title: "Erreur!",
                    text:
                        err instanceof Error
                            ? err.message
                            : "Une erreur est survenue lors de la mise à jour de l'opérateur",
                    icon: "error",
                    confirmButtonText: "OK",
                });

                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Supprimer un opérateur
    const deleteOperator = useCallback(
        async (operatorId: string): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const token =
                    typeof window !== "undefined"
                        ? localStorage.getItem("auth-token")
                        : null;

                if (!token) {
                    throw new Error("Non authentifié");
                }

                // Confirmation avant suppression
                const confirmResult = await Swal.fire({
                    title: "Êtes-vous sûr?",
                    text: "Cette action ne peut pas être annulée!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Oui, supprimer!",
                    cancelButtonText: "Annuler",
                });

                if (!confirmResult.isConfirmed) {
                    setLoading(false);
                    return false;
                }

                const response = await fetch(`/api/operators/${operatorId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Erreur lors de la suppression de l'opérateur"
                    );
                }

                // Mise à jour de l'état local
                setOperators((prev) => prev.filter((op) => op.id !== operatorId));

                Swal.fire({
                    title: "Supprimé!",
                    text: "L'opérateur a été supprimé avec succès",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                return true;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Une erreur est survenue"
                );

                Swal.fire({
                    title: "Erreur!",
                    text:
                        err instanceof Error
                            ? err.message
                            : "Une erreur est survenue lors de la suppression de l'opérateur",
                    icon: "error",
                    confirmButtonText: "OK",
                });

                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Récupérer un opérateur par ID
    const getOperatorById = useCallback(async (operatorId: string) => {
        setLoading(true);
        setError(null);

        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("auth-token")
                    : null;

            if (!token) {
                throw new Error("Non authentifié");
            }

            const response = await fetch(`/api/operators/${operatorId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erreur lors du chargement de l'opérateur"
                );
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtenir les statuts d'opérateur disponibles
    const getOperatorStatuses = useCallback((): OperatorStatus[] => {
        return ["ACTIVE", "PENDING", "SUSPENDED"];
    }, []);

    // Obtenir les types de transport disponibles
    const getTransportTypes = useCallback((): TransportType[] => {
        return ["BUS", "TRAIN", "BOAT", "PLANE"];
    }, []);

    return {
        operators,
        countries,
        lines,
        loading,
        error,
        
        fetchOperators,
        fetchCountries,
        fetchLines,
        addOperator,
        editOperator,
        deleteOperator,
        getOperatorById,
        getOperatorStatuses,
        getTransportTypes,
    };
};
