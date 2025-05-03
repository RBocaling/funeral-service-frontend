import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileProgressState = {
  isCompleteProfileModalOpen: boolean;
  setCompleteProfileModal: (isOpen: boolean) => void;
};

export const useProfileProgress = create<ProfileProgressState>()(
  persist(
    (set) => ({
      isCompleteProfileModalOpen: true,
      setCompleteProfileModal: (isOpen: boolean) => set({ isCompleteProfileModalOpen: isOpen }),
    }),
    {
      name: "profile-progress", 
    }
  )
);
