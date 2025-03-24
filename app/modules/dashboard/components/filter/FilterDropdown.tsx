import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { FilterDropdownProps } from '../../types';

const FilterDropdown: React.FC<FilterDropdownProps> = ({ roles, selectedRole, onRoleChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative inline-block text-left w-full sm:w-auto">
            <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    <span>Rôle: {selectedRole}</span>
                </div>
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                    <div className="py-1">
                        {roles.map((role) => (
                            <button
                                key={role}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                    selectedRole === role ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    onRoleChange(role);
                                    setIsOpen(false);
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;