import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleEllipsis, MenuIcon, Search, X } from "lucide-react";
import { Chat } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageStore } from "@/store/messageStore";
import CustomerDocument from "./funeralDocumentId";
import { useState } from "react";



export function ChatHeader({ isSidebarOpen, setIsSidebarOpen }: any) {
  
  const { conversationid } = useMessageStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenId, setIsOpenId] = useState(false)
  
  console.log("conversationid hehader",conversationid);
  conversationid?.customerDocuementId?.documentId
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-lg">
      {/* <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <MenuIcon className="h-5 w-5" />
      </Button> */}
      <div className="flex flex-1 items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar  className="h-8 w-8">
              <AvatarImage
                src={conversationid?.customerDocuementId?.documentId || ""}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background bg-green-500" />
            </div>
            <span className="font-semibold">{conversationid?.name ?? null}</span>
        </div>
        
        <CircleEllipsis size={25} className="cursor-pointer hover:text-white/50" onClick={()=> setIsSidebarOpen(true)} />
        {
          isSidebarOpen && <div className=" ml-auto max-w-xs absolute right-0 top-0 w-full h-[80vh] bg-gray-800 rounded-2xl flex flex-col gap-5 p-12">
            <div className="flex items-center gap-3 mb-5 text-2xl">
            <div className="relative">
              <Avatar  className="h-8 w-8">
              <AvatarImage
                 src={conversationid?.customerDocuementId?.documentId || ""}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background bg-green-500" />
            </div>
            <span className="font-semibold">{conversationid?.name ?? null}</span>
        </div>
          <button  onClick={()=> setIsOpenId(true)} className="text-base font-medium b border border-sky-500 py-2 px-5 rounded-full shadow-xl shadow-sky-500/10 cursor-pointer"> Funeral Documents</button>
           
         </div>
       }
      </div>

      <CustomerDocument isOpen={isOpenId} setIsOpen={setIsOpenId} />
    </div>
  );
}
