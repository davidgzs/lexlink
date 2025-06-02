import type { Conversation } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-accent/50 transition-colors",
        isSelected ? "bg-accent" : ""
      )}
    >
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={conversation.avatarUrl} alt={conversation.clientName} data-ai-hint="person avatar" />
        <AvatarFallback>{conversation.clientName.substring(0, 1)}{conversation.attorneyName.substring(0,1)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm truncate font-body">{conversation.clientName} & {conversation.attorneyName}</h3>
          {conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate font-body">{conversation.lastMessagePreview}</p>
        <p className="text-xs text-muted-foreground/70 font-body">{new Date(conversation.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </button>
  );
}
