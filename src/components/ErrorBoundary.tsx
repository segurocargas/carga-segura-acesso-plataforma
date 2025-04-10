import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2d2d2d] rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Oops! Algo deu errado</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="flex items-center px-6 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl transition-colors"
          >
            <RefreshCw className="mr-2" size={20} />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}