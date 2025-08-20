
import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-dashed rounded-full animate-spin mb-2"></div>
            <p className="text-gray-300 text-sm">Drawing...</p>
        </div>
    );
};
