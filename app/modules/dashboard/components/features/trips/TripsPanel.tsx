    "use client";

    import React from "react";
    import { Edit, Trash } from "lucide-react";
    import { Trip } from "../../../types";

    type VehiclesPanelProps = {
        trips: Trip[];
    };

    const TripPanel: React.FC<VehiclesPanelProps> = ({ trips }) => {
        return (
            <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ - Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {trips.map((trip) => (
                            <tr key={trip.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{trip.depart}</div>
                                    <div className="text-sm text-gray-500">→ {trip.destination}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {trip.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${trip.status === 'planifié' ? 'bg-blue-100 text-blue-800' : 
                                        trip.status === 'en cours' ? 'bg-yellow-100 text-yellow-800' : 
                                        trip.status === 'terminé' ? 'bg-green-100 text-green-800' : 
                                        'bg-red-100 text-red-800'}`}>
                                        {trip.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                                        <Edit size={16} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        );
    };

    export default TripPanel;
