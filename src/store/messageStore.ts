import { create } from 'zustand';



type messageTypeState = {
  conversationid: any;
  setConversationid: (data: any) => void;
};

export const useMessageStore = create<messageTypeState>((set) => ({
  conversationid: null,
  setConversationid: (data:any) => set({ conversationid: data }),
}));
