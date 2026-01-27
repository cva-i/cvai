import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@ui/lib/utils';
import { Button } from '@ui/components/ui/button';
import { Send, Loader2, Trash2, MessageSquare } from 'lucide-react';
import { useChat } from '../../../contexts/use-chat';
import { useCurrentCv } from '../../../contexts/use-current-cv';
import { ChatMessage } from './ChatMessage';

export const ChatPanel: React.FC = () => {
  const {
    messages,
    isLoading,
    isSending,
    sendMessage,
    acceptAction,
    rejectAction,
    clearConversation,
    fetchMessages,
  } = useChat();
  const { currentCvId } = useCurrentCv();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitialLoad = useRef(true);

  // Fetch messages when CV changes
  useEffect(() => {
    if (currentCvId) {
      isInitialLoad.current = true;
      fetchMessages(currentCvId);
    }
  }, [currentCvId, fetchMessages]);

  // Scroll to bottom when messages change or when sending
  useEffect(() => {
    if (isInitialLoad.current) {
      // Instant scroll on initial load
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      isInitialLoad.current = false;
    } else {
      // Smooth scroll for new messages
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!currentCvId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Select a CV to chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Ask AI to edit your CV</p>
            <p className="mt-1 text-xs text-gray-400">
              e.g. &quot;Add work experience at Google&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <ChatMessage
                key={message._id}
                message={message}
                onAcceptAction={acceptAction}
                onRejectAction={rejectAction}
              />
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI..."
            rows={1}
            disabled={isSending}
            className={cn(
              'flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm',
              'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'min-h-[36px] max-h-[100px]'
            )}
          />
          {messages.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              className="h-9 w-9 shrink-0 text-gray-400 hover:text-red-500"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isSending}
            className="h-9 w-9 shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
