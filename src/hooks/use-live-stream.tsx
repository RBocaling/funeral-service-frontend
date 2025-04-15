import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./use-auth";

// Message types
export type MessageType = 'chat' | 'reaction' | 'user_joined' | 'user_left';

export interface StreamMessage {
  type: MessageType;
  userId?: number | string;
  username?: string;
  message?: string;
  reactionType?: string;
  timestamp: string;
}

interface UseLiveStreamProps {
  sessionId: string | number;
  onMessage?: (message: StreamMessage) => void;
}

export function useLiveStream({ sessionId, onMessage }: UseLiveStreamProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const { user } = useAuth();
  
  // Track connection attempts
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
     
      return;
    }
    
    try {
      if (socket) {
        socket.close();
      }
      
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const newSocket = new WebSocket(wsUrl);
      
      newSocket.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        if (user) {
          const joinMessage = {
            type: 'join',
            sessionId: sessionId,
            userId: user.id,
            username: user.username || user.fullName,
          };
          newSocket.send(JSON.stringify(joinMessage));
        }
      };
      
      newSocket.onclose = (event) => {
        setIsConnected(false);
        
        if (event.code !== 1000) {
          reconnectAttempts.current += 1;
          setTimeout(connect, 2000); 
        }
      };
      
      newSocket.onerror = () => {
        
        newSocket.close();
      };
      
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type) {
            const message: StreamMessage = {
              type: data.type,
              userId: data.userId,
              username: data.username,
              message: data.message,
              reactionType: data.reactionType,
              timestamp: data.timestamp || new Date().toISOString(),
            };
            
            setMessages(prev => [...prev, message]);
            
            if (onMessage) {
              onMessage(message);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      
      
    }
  }, [sessionId, user, socket, onMessage]);
  
  useEffect(() => {
    connect();
    
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        if (user) {
          const leaveMessage = {
            type: 'leave',
            sessionId: sessionId,
            userId: user.id,
            username: user.username || user.fullName,
          };
          socket.send(JSON.stringify(leaveMessage));
        }
        socket.close();
      }
    };
  }, [connect, sessionId, socket, user]);
  
  // Send a chat message
  const sendChatMessage = useCallback((message: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) {
     
      return;
    }
    
    const chatMessage = {
      type: 'chat',
      sessionId: sessionId,
      userId: user.id,
      username: user.username || user.fullName,
      message: message,
      timestamp: new Date().toISOString(),
    };
    
    socket.send(JSON.stringify(chatMessage));
  }, [sessionId, socket, user]);
  
  // Send a reaction
  const sendReaction = useCallback((reactionType: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) {
    
      return;
    }
    
    const reactionMessage = {
      type: 'reaction',
      sessionId: sessionId,
      userId: user.id,
      username: user.username || user.fullName,
      reactionType: reactionType,
      timestamp: new Date().toISOString(),
    };
    
    socket.send(JSON.stringify(reactionMessage));
  }, [sessionId, socket, user]);
  
  return {
    isConnected,
    messages,
    sendChatMessage,
    sendReaction,
  };
}