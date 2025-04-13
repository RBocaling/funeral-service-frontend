import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  User,
  MessageSquare,
  Clock,
  Send,
  Paperclip,
} from "lucide-react";

// Contact interface
interface Contact {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  avatar?: string;
  isOnline?: boolean;
  businessName?: string;
}

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Format time for messages
  const formatMessageTime = (date: Date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Mock data for development
  const mockContacts: Contact[] = [
    {
      id: 201,
      name: "Eternal Rest Funeral Homes",
      lastMessage:
        "Thank you for your booking. We'll be ready to assist you on the scheduled date.",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      avatar: "https://ui-avatars.com/api/?name=Eternal+Rest&background=random",
      isOnline: true,
      businessName: "Eternal Rest Funeral Homes",
    },
    {
      id: 202,
      name: "Peaceful Gardens Memorial",
      lastMessage:
        "We've received your flower arrangement request and will prepare it for the service.",
      lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 2,
      avatar:
        "https://ui-avatars.com/api/?name=Peaceful+Gardens&background=random",
      isOnline: false,
      businessName: "Peaceful Gardens Memorial",
    },
    {
      id: 203,
      name: "Serenity Funeral Services",
      lastMessage:
        "Your custom casket design has been approved. We'll start the production process.",
      lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unreadCount: 0,
      avatar:
        "https://ui-avatars.com/api/?name=Serenity+Services&background=random",
      isOnline: true,
      businessName: "Serenity Funeral Services",
    },
  ];

  // Mock chat messages for demonstration
  const mockChatMessages = [
    {
      id: 1,
      senderId: 201, // Provider
      receiverId: 1 || 0,
      content: "Hello! Thank you for booking our Premium Memorial Service.",
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 201,
      content:
        "Thank you for confirming. I have some questions about the flower arrangements.",
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: 3,
      senderId: 201,
      receiverId: 3,
      content:
        "Of course! We offer various options including roses, lilies, and carnations in different arrangements.",
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: 4,
      senderId: 4,
      receiverId: 201,
      content:
        "I'd like to go with white lilies for the casket spray. Is that possible?",
      isRead: true,
      createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    },
    {
      id: 5,
      senderId: 201,
      receiverId: 5,
      content:
        "Absolutely. White lilies are a beautiful choice. We'll include that in your arrangement. Would you like any additional flowers for the memorial room?",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  // Filtered contacts based on search term and active tab
  const filteredContacts = mockContacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (contact) =>
        activeTab === "all" ||
        (activeTab === "unread" && contact.unreadCount) ||
        0 > 0
    );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      // Implementation would use API requests to send message
      console.log("Sending message to", selectedContact.id, ":", messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container py-10 px-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">
          Communicate with funeral service providers
        </p>
      </div>

      <Card className="h-[calc(100vh-220px)] dark:bg-gray-700/20 rounded-3xl">
        <CardContent className="p-0 h-full flex">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8 py-3 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-4 "
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All Messages</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p>No conversations found</p>
                  <p className="text-sm mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : activeTab === "unread"
                      ? "No unread messages"
                      : "Contact a provider to start chatting"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        selectedContact?.id === contact.id
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={contact.avatar}
                              alt={contact.name}
                            />
                            <AvatarFallback>{contact.name[0]}</AvatarFallback>
                          </Avatar>
                          {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground truncate">
                              {contact.name}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {contact.lastMessageTime
                                ? formatMessageTime(contact.lastMessageTime)
                                : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.lastMessage}
                            </p>
                            {contact.unreadCount ||
                              (0 > 0 && (
                                <span className="ml-2 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                  {contact.unreadCount}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message Content */}
          <div className="hidden md:flex flex-col flex-1">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                      />
                      <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {selectedContact.isOnline ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                            Online
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Offline
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === 1 ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.senderId !== 2 && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage
                              src={selectedContact.avatar}
                              alt={selectedContact.name}
                            />
                            <AvatarFallback>
                              {selectedContact.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderId === 3
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span
                            className={`text-xs block mt-1 ${
                              msg.senderId === 4
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select a conversation from the sidebar to view and reply to
                  messages from funeral service providers
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
