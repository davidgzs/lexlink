"use client";

import { useState, useEffect, useRef } from 'react';
import { mockConversations, mockMessages, mockUserProfile } from '@/lib/mockData';
import type { Conversation, Message } from '@/types';
import ConversationItem from '@/components/messages/ConversationItem';
import ChatMessage from '@/components/messages/ChatMessage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    if (selectedConversationId) {
      // Simulate fetching messages for the selected conversation
      const convMessages = mockMessages.filter(m => m.conversationId === selectedConversationId)
        .map(m => ({ ...m, isOwnMessage: m.senderId === `client_${mockUserProfile.name.toLowerCase().replace(' ','_')}`})); // Adjust senderId check logic as needed
      setMessages(convMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    const message: Message = {
      id: `M${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: `client_${mockUserProfile.name.toLowerCase().replace(' ','_')}`, // Adjust as per your user model
      senderName: mockUserProfile.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwnMessage: true,
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation preview (mock)
    setConversations(prevConvs => prevConvs.map(conv => 
      conv.id === selectedConversationId ? { ...conv, lastMessagePreview: newMessage, lastMessageTimestamp: new Date().toISOString() } : conv
    ));
  };
  
  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col md:flex-row gap-4 overflow-hidden">
      <Card className="md:w-1/3 lg:w-1/4 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
          <ScrollArea className="h-full p-2">
            {conversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                onSelect={() => setSelectedConversationId(conv.id)}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                   <AvatarImage src={selectedConversation.avatarUrl} alt={selectedConversation.clientName} data-ai-hint="person avatar"/>
                   <AvatarFallback>{selectedConversation.clientName.substring(0, 1)}{selectedConversation.attorneyName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-headline text-lg">{selectedConversation.clientName} & {selectedConversation.attorneyName}</h2>
                    <p className="text-xs text-muted-foreground font-body">Online</p> {/* Placeholder status */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" type="button"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 font-body"
                aria-label="New message"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <MessagesSquare className="h-24 w-24 text-muted-foreground/50 mb-4" />
            <h2 className="font-headline text-2xl text-muted-foreground">Select a conversation</h2>
            <p className="font-body text-muted-foreground">Choose a conversation from the list to start chatting.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
