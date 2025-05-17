import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetMessageList } from "@/hooks/controllers/useMessage";
import { useMessageStore } from "@/store/messageStore";



export function ChatList() {
  const {data} = useGetMessageList()
  const {conversationid ,setConversationid} = useMessageStore()

  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-1 p-2 w-80">
        {data?.map((chat:any) => (
          <button
            key={chat.id}
            className={`w-full rounded-xl p-3 text-left transition-all hover:bg-secondary/80 active:scale-[0.98] ${
              conversationid?.id === chat.id ? "bg-secondary" : ""
            }`}
            onClick={() => setConversationid(chat)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{chat.name}</span>
                  <p className="mt-0.5 truncate  text-xs text-muted-foreground py-1 px-3 rounded-full bg-gray-700/50 lowercase">
                  {chat.bookingStatus}
                </p>
                </div>
               
                <span className="text-xs text-muted-foreground">
                    {chat.appointmentDate}
                  </span>
              </div>
             
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
