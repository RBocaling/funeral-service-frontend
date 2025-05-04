import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAlertStore } from '@/store/alertStore';

const Alert: React.FC = () => {
  const { alertState, handleConfirm, handleCancel } = useAlertStore();
  const {
    type,
    title,
    message,
    confirmButtonText = 'OK',
    cancelButtonText = 'Cancel',
    isOpen,
  } = alertState;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  const AlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 animate-bounce-subtle" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500 animate-shake" />;
      case 'confirmation':
        return <AlertCircle className="w-16 h-16 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-50/90 to-green-100/90';
      case 'error':
        return 'bg-gradient-to-br from-red-50/90 to-red-100/90';
      case 'confirmation':
        return 'bg-gradient-to-br from-blue-50/90 to-blue-100/90';
      default:
        return 'bg-gradient-to-br from-white/90 to-gray-50/90';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500';
      case 'confirmation':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300" onClick={handleCancel} />
      <div 
        className={`w-full max-w-sm rounded-3xl shadow-2xl ${getBackgroundColor()} p-8 transform transition-all duration-500 ease-out scale-100 opacity-100 backdrop-blur-xl border border-white/20`}
        style={{ 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex justify-center transform transition-transform duration-300 hover:scale-110">
            <AlertIcon />
          </div>
          
          {title && (
            <h3 className="mb-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              {title}
            </h3>
          )}
          
          {message && (
            <p className="mb-8 text-base text-gray-600 leading-relaxed">
              {message}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {type === 'confirmation' && (
              <button
                onClick={handleCancel}
                className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100/80 rounded-2xl hover:bg-gray-200/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg"
              >
                {cancelButtonText}
              </button>
            )}
            
            <button
              onClick={handleConfirm}
              className={`w-full px-6 py-3 text-sm font-medium text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${getButtonColor()}`}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;