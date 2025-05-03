import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatList } from "./chat-list";
import { Chat, TabType } from "@/lib/types";
import { Plus } from "lucide-react";
import { NewChatDialog } from "./new-chat.dialog";
import TitlePage from "../ui/title-page";
import { useGetMessageList } from "@/hooks/controllers/useMessage";

interface SidebarProps {
  isOpen: boolean;
  chats: Chat[];
  selectedChatId: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: (chat: Chat) => void;
}

export function ChatSidebar() {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 w-80 h-[80vh] transform  bg-gray-700/20 rounded-3xl  backdrop-blur-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        false ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <TitlePage label="Messages" />
        <NewChatDialog
          // onNewChat={onNewChat}
          trigger={
            <Button size="icon" variant="ghost" className="rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          }
        />
      </div>
      <div className="p-4">
      </div>
      <ChatList />
    </div>
  );
}
