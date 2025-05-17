import { ChatList } from "./chat-list";
import { NewChatDialog } from "./new-chat.dialog";
import TitlePage from "../ui/title-page";


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
          
        />
      </div>
      <div className="p-4">
      </div>
      <ChatList />
    </div>
  );
}
