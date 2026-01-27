import React from 'react';
import { cn } from '@ui/lib/utils';
import type { ChatMessage as ChatMessageType } from '../../../contexts/use-chat/types';
import { ActionBubble } from './ActionBubble';

interface ChatMessageProps {
  message: ChatMessageType;
  onAcceptAction: (messageId: string, actionId: string) => void;
  onRejectAction: (messageId: string, actionId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onAcceptAction,
  onRejectAction,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('mb-3', isUser ? 'text-right' : 'text-left')}>
      <div
        className={cn(
          'inline-block rounded-2xl px-3 py-2 text-sm max-w-[90%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Proposed actions (only for assistant messages) */}
      {!isUser && message.proposedActions.length > 0 && (
        <div className="mt-2 space-y-2">
          {message.proposedActions.map((action) => (
            <ActionBubble
              key={action._id}
              action={action}
              messageId={message._id}
              onAccept={onAcceptAction}
              onReject={onRejectAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};
