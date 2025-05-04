import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';

// Alert types
export type AlertType = 'success' | 'error' | 'confirmation';

// Alert configuration options
export interface AlertOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

// Alert state interface
export interface AlertState extends AlertOptions {
  isOpen: boolean;
  type: AlertType;
  resolve?: (value: boolean) => void;
}

// Default state
const defaultAlertState: AlertState = {
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  autoClose: true,
  autoCloseTime: 4000, // 4 seconds default
};

// Context interface
interface AlertContextType {
  alertState: AlertState;
  showAlert: (type: AlertType, options: AlertOptions) => Promise<boolean>;
  hideAlert: () => void;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Provider component
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>(defaultAlertState);
  const timeoutRef = useRef<number>();

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Show alert and return a promise
  const showAlert = (type: AlertType, options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      const newAlertState: AlertState = {
        ...defaultAlertState,
        ...options,
        type,
        isOpen: true,
        resolve,
      };

      setAlertState(newAlertState);

      // Auto close for non-confirmation alerts
      if (type !== 'confirmation') {
        timeoutRef.current = window.setTimeout(() => {
          hideAlert();
          resolve(true);
        }, options.autoCloseTime || 4000);
      }
    });
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    if (alertState.onConfirm) {
      alertState.onConfirm();
    }
    
    if (alertState.resolve) {
      alertState.resolve(true);
    }
    
    hideAlert();
  };

  // Handle cancellation
  const handleCancel = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    if (alertState.onCancel) {
      alertState.onCancel();
    }
    
    if (alertState.resolve) {
      alertState.resolve(false);
    }
    
    hideAlert();
  };

  // Enhanced alert state with handlers
  const enhancedAlertState: AlertState = {
    ...alertState,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return (
    <AlertContext.Provider
      value={{
        alertState: enhancedAlertState,
        showAlert,
        hideAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook for using the alert
export const useAlert = () => {
  const context = useContext(AlertContext);
  
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  
  return context;
};