import { useState } from "react";
import { MessageList } from "@/components/messaging/message-list";
import { ChatSidebar } from "@/components/messaging/chat-sidebar";
import { ChatHeader } from "@/components/messaging/chat-header";
import { chats as initialChats, messages as initialMessages, messages, } from "@/lib/mockdata";
import { Chat, Message, TabType } from "@/lib/types";
import { useGetMessage } from "@/hooks/controllers/useMessage";
import { useMessageStore } from "@/store/messageStore";
import useProgressProfile from "@/hooks/controllers/useUserProgress";

function Messages() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(initialChats[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const {conversationid} = useMessageStore()
  const {
    
    progress,
  } = useProgressProfile();
  const {data} = useGetMessage(conversationid?.id)
  return (
    <div className="flex overflow-hidden bg-background mx-auto max-w-7xl relative">
      <ChatSidebar
      />
      {
        data?.length > 0 ? <div className="flex flex-1 flex-col">
        <ChatHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
        />
        <main onClick={()=> setIsSidebarOpen(false)} className="relative flex-1">
          <MessageList messages={data} />
        </main>
      </div>: <div className="flex flex-1 flex-col h-40 flex items-center justify-center">
       No Message Selected
      </div>
      }



{
        progress < 100 &&  <div className="absolute z-50 top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center text-red-500 text-lg font-medium">
        Please Complete Your Profile
        </div>
      }
    </div>
  );
}

export default Messages;
