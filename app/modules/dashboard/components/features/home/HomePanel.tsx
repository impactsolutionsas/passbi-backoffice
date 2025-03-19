import React from 'react';
import { Users, Car, Map } from 'lucide-react';
import StatCard from '../../stats/StatCard';
import { Stats } from '../../../types';

type HomePanelProps = {
    stats: Stats;
};

const HomePanel: React.FC<HomePanelProps> = ({ stats }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Tableau de Bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Utilisateurs"
                    value={stats.utilisateurs.total}
                    increase={stats.utilisateurs.augmentation}
                    icon={<Users size={24} className="text-blue-500" />}
                />
                <StatCard
                    title="Véhicules"
                    value={stats.vehicules.total}
                    increase={stats.vehicules.augmentation}
                    icon={<Car size={24} className="text-green-500" />}
                />
                <StatCard
                    title="Trajets"
                    value={stats.trajets.total}
                    increase={stats.trajets.augmentation}
                    icon={<Map size={24} className="text-purple-500" />}
                />
                <StatCard
                    title="Nouveaux utilisateurs"
                    value={stats.nouveauxUtilisateurs.total}
                    increase={stats.nouveauxUtilisateurs.augmentation}
                    icon={<Users size={24} className="text-orange-500" />}
                />
            </div>
        </div>
    );
};

export default HomePanel;