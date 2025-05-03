import { create } from 'zustand';

type ServiceType = 'CASKET' | 'FLOWERS' | '';

type ServiceTypeState = {
  serviceType: ServiceType;
    setServiceType: (type: ServiceType) => void;
    selectedSBooking: any;
    setSelectedBooking: (type: ServiceType) => void;
};


export const useServiceTypeStore = create<ServiceTypeState>((set) => ({
    serviceType: '',
    selectedSBooking: null,
  setServiceType: (type) => set({ serviceType: type }),
  setSelectedBooking: (data:any) => set({ selectedSBooking: data }),
}));


