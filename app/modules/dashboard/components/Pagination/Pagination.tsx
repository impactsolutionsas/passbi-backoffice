import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '../../types';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePageNumbers = 5;
    let pages = [];
    
    if (totalPages <= visiblePageNumbers) {
        // Afficher tous les numéros de page si le total est inférieur au nombre visible
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        // Calculer les pages à afficher autour de la page actuelle
        const leftBound = Math.max(1, currentPage - Math.floor(visiblePageNumbers / 2));
        const rightBound = Math.min(totalPages, leftBound + visiblePageNumbers - 1);
        
        pages = Array.from({ length: rightBound - leftBound + 1 }, (_, i) => leftBound + i);
    }
    
    return (
        <div className="flex justify-between items-center py-3">
            <div className="text-sm text-gray-700">
                Affichage <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span> pages
            </div>
            
            <div className="inline-flex rounded-md shadow-sm">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={14} />
                </button>
                
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === page 
                            ? 'bg-blue-50 text-blue-600 z-10 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;