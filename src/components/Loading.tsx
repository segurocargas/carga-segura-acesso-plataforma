import React from 'react';

interface LoadingProps {
  isLoading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
        <span className="text-sm">Consultando...</span>
      </div>
    </div>
  );
};