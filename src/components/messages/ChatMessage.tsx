import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isOwn = message.isOwnMessage;
  return (
    <div className={cn("flex items-end gap-2 my-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={`https://placehold.co/32x32.png/000000/FFFFFF?text=${message.senderName.substring(0,1)}`} alt={message.senderName} data-ai-hint="person initial" />
          <AvatarFallback>{message.senderName.substring(0, 1)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-lg shadow-sm font-body",
          isOwn ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isOwn && (
         <Avatar className="h-8 w-8 border">
          <AvatarImage src={`https://placehold.co/32x32.png/FFFFFF/000000?text=${message.senderName.substring(0,1)}`} alt={message.senderName} data-ai-hint="person initial" />
          <AvatarFallback>{message.senderName.substring(0, 1)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
