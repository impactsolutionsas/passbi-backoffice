import React from 'react';

type StatCardProps = {
    title: string;
    value: number;
    increase: string;
    icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, increase, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="font-bold text-2xl mt-1">{value}</h3>
                <p className="text-xs mt-1">
                    <span className={`${increase.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {increase}
                    </span> depuis le mois dernier
                </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

export default StatCard;