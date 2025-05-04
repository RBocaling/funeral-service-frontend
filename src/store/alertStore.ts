import { create } from 'zustand';

// Alert types
export type AlertType = 'success' | 'error' | 'confirmation';

// Alert configuration options
export interface AlertOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  autoClose?: boolean;
  autoCloseTime?: number;
}

// Alert state interface
export interface AlertState extends AlertOptions {
  isOpen: boolean;
  type: AlertType;
  resolve?: (value: boolean) => void;
}

interface AlertStore {
  alertState: AlertState;
  timeoutId?: number;
  showAlert: (type: AlertType, options: AlertOptions) => Promise<boolean>;
  hideAlert: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const defaultAlertState: AlertState = {
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  autoClose: true,
  autoCloseTime: 4000,
};

export const useAlertStore = create<AlertStore>((set, get) => ({
  alertState: defaultAlertState,
  timeoutId: undefined,

  hideAlert: () => {
    const { timeoutId } = get();
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    set((state) => ({ 
      alertState: { ...state.alertState, isOpen: false },
      timeoutId: undefined
    }));
  },

  showAlert: (type: AlertType, options: AlertOptions) => {
    const { timeoutId } = get();
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    return new Promise<boolean>((resolve) => {
      const newAlertState: AlertState = {
        ...defaultAlertState,
        ...options,
        type,
        isOpen: true,
        resolve,
      };

      set({ alertState: newAlertState });

      if (type !== 'confirmation') {
        const newTimeoutId = window.setTimeout(() => {
          get().hideAlert();
          resolve(true);
        }, options.autoCloseTime || 4000);
        
        set({ timeoutId: newTimeoutId });
      }
    });
  },

  handleConfirm: () => {
    const { alertState, timeoutId } = get();
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    if (alertState.resolve) {
      alertState.resolve(true);
    }
    
    get().hideAlert();
  },

  handleCancel: () => {
    const { alertState, timeoutId } = get();
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    if (alertState.resolve) {
      alertState.resolve(false);
    }
    
    get().hideAlert();
  }
}));