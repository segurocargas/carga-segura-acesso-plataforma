import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-[300px]">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-red-500" size={24} />
        </div>
        <p className="text-center text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full h-10 bg-primary text-white rounded-button"
        >
          OK
        </button>
      </div>
    </div>
  );
};