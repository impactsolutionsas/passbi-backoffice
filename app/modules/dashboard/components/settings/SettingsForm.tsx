'use client';

import React from 'react';
import { Edit, Trash } from 'lucide-react';

const Settings: React.FC<{}> = ({ ...props }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Paramètres du Système</h2>
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Paramètres généraux</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de l'application
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            defaultValue="PassBi Admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email de contact
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            defaultValue="contact@passbi.sn"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Langue par défaut
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="fr">Français</option>
                            <option value="en">Anglais</option>
                            <option value="wo">Wolof</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Enregistrer les modifications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
