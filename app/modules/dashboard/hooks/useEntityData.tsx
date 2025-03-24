'use client';
import { useState, useMemo } from 'react';
import {  Vehicle, Trip, Stats } from '../types';
import { RegisterUserDTO } from '../../auth/types/auth.types';

export function useFilteredUsers(users: RegisterUserDTO[], searchTerm: string) {
  return useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
}

export function useFilteredVehicles(vehicles: Vehicle[], searchTerm: string) {
  return useMemo(() => {
    return vehicles.filter(vehicle => 
      vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) || 
      vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);
}

export function useFilteredTrips(trips: Trip[], searchTerm: string) {
  return useMemo(() => {
    return trips.filter(trip => 
      trip.depart.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [trips, searchTerm]);
}

// Données simulées pour l'exemple
const mockUsers: RegisterUserDTO[] = [
  // Ajoutez quelques utilisateurs d'exemple ici
];

const mockVehicles: Vehicle[] = [
  // Ajoutez quelques véhicules d'exemple ici
];

const mockTrips: Trip[] = [
  // Ajoutez quelques trajets d'exemple ici
];

const mockStats: Stats = {
  utilisateurs: { total: mockUsers.length, augmentation: "+5%" },
  vehicules: { total: mockVehicles.length, augmentation: "+2%" },
  trajets: { total: mockTrips.length, augmentation: "+10%" },
  nouveauxUtilisateurs: { total: 8, augmentation: "+15%" },
};

// Hook principal qui sera exporté par défaut
export default function useEntityData() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = useFilteredUsers(mockUsers, searchTerm);
  const filteredVehicles = useFilteredVehicles(mockVehicles, searchTerm);
  const filteredTrips = useFilteredTrips(mockTrips, searchTerm);

  return {
    stats: mockStats,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    filteredVehicles,
    filteredTrips
  };
}