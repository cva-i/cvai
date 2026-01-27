import React, {
  createContext,
  use,
  useCallback,
  useState,
  useMemo,
} from 'react';
import type {
  ChatContextType,
  ChatMessage,
  ProposedAction,
  ChatMessageRole,
  ProposedActionType,
  ProposedActionStatus,
} from './types';
import {
  useGetChatMessagesLazyQuery,
  useSendChatMessageMutation,
  useRespondToProposedActionMutation,
  useClearChatConversationMutation,
  ChatMessageRole as GqlChatMessageRole,
  ProposedActionType as GqlProposedActionType,
  ProposedActionStatus as GqlProposedActionStatus,
  refetchGetCvQuery,
  refetchGetWorkExperienceEntriesQuery,
  refetchGetEducationEntriesQuery,
  refetchGetProjectEntriesQuery,
  refetchGetSkillEntriesQuery,
  refetchGetContactInfoEntriesQuery,
  refetchGetAboutMeQuery,
  refetchGetNameQuery,
  type ChatMessageObjectType,
} from '../../generated/graphql';
import { useCurrentCv } from '../use-current-cv';
import { toast } from 'react-toastify';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const mapGqlRole = (role: GqlChatMessageRole): ChatMessageRole => {
  return role === GqlChatMessageRole.User ? 'user' : 'assistant';
};

const mapGqlActionType = (type: GqlProposedActionType): ProposedActionType => {
  switch (type) {
    case GqlProposedActionType.UpdateField:
      return 'update_field';
    case GqlProposedActionType.AddEntry:
      return 'add_entry';
    case GqlProposedActionType.DeleteEntry:
      return 'delete_entry';
    case GqlProposedActionType.ReorderEntries:
      return 'reorder_entries';
    case GqlProposedActionType.ClarifyingQuestion:
      return 'clarifying_question';
    default:
      return 'clarifying_question';
  }
};

const mapGqlActionStatus = (
  status: GqlProposedActionStatus
): ProposedActionStatus => {
  switch (status) {
    case GqlProposedActionStatus.Pending:
      return 'pending';
    case GqlProposedActionStatus.Accepted:
      return 'accepted';
    case GqlProposedActionStatus.Rejected:
      return 'rejected';
    default:
      return 'pending';
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentCvId } = useCurrentCv();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // GraphQL hooks
  const [getChatMessagesQuery, { loading: isLoading }] =
    useGetChatMessagesLazyQuery();
  const [sendMessageMutation, { loading: isSending }] =
    useSendChatMessageMutation();
  const [respondToActionMutation] = useRespondToProposedActionMutation();
  const [clearConversationMutation] = useClearChatConversationMutation();

  // Map GraphQL message to local type
  const mapGqlMessage = useCallback(
    (gqlMessage: ChatMessageObjectType): ChatMessage => ({
      _id: gqlMessage._id,
      conversationId: gqlMessage.conversationId,
      cvId: gqlMessage.cvId,
      userId: gqlMessage.userId,
      role: mapGqlRole(gqlMessage.role),
      content: gqlMessage.content,
      proposedActions: gqlMessage.proposedActions.map(
        (action): ProposedAction => ({
          _id: action._id,
          type: mapGqlActionType(action.type),
          description: action.description,
          payload: action.payload as Record<string, unknown>,
          status: mapGqlActionStatus(action.status),
        })
      ),
      cvVersionIdAtCreation: gqlMessage.cvVersionIdAtCreation ?? undefined,
      createdAt: new Date(gqlMessage.createdAt),
      updatedAt: new Date(gqlMessage.updatedAt),
    }),
    []
  );

  // Fetch messages for a CV
  const fetchMessages = useCallback(
    async (cvId: string) => {
      try {
        setError(null);
        const { data } = await getChatMessagesQuery({
          variables: { cvId, conversationId },
        });

        if (data?.getChatMessages) {
          const mappedMessages = data.getChatMessages.map(mapGqlMessage);
          setMessages(mappedMessages);

          // Extract conversation ID from first message if available
          if (mappedMessages.length > 0) {
            setConversationId(mappedMessages[0].conversationId);
          }
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch messages');
        setError(error);
        toast.error(error.message);
        console.error('Failed to fetch chat messages:', err);
      }
    },
    [getChatMessagesQuery, conversationId, mapGqlMessage]
  );

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentCvId) {
        toast.error('Please select a CV first');
        return;
      }

      try {
        setError(null);

        // Optimistically add user message
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: ChatMessage = {
          _id: tempId,
          conversationId: conversationId || tempId,
          cvId: currentCvId,
          userId: 'current-user',
          role: 'user',
          content,
          proposedActions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        const { data } = await sendMessageMutation({
          variables: {
            input: {
              cvId: currentCvId,
              content,
              conversationId: conversationId || undefined,
            },
          },
        });

        if (data?.sendChatMessage) {
          const assistantMessage = mapGqlMessage(data.sendChatMessage);

          // Update conversation ID if not set
          if (!conversationId) {
            setConversationId(assistantMessage.conversationId);
          }

          // Replace optimistic message with actual user message and add assistant response
          setMessages((prev) => {
            // Remove the optimistic message
            const withoutOptimistic = prev.filter((m) => m._id !== tempId);
            // The server returns the assistant message, we need to also add a proper user message
            // Actually, the server creates both messages, so we should refetch
            return [
              ...withoutOptimistic,
              {
                ...optimisticMessage,
                _id: `user-${Date.now()}`,
                conversationId: assistantMessage.conversationId,
              },
              assistantMessage,
            ];
          });
        }
      } catch (err) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => !m._id.startsWith('temp-')));

        const error =
          err instanceof Error ? err : new Error('Failed to send message');
        setError(error);
        toast.error(error.message);
        console.error('Failed to send chat message:', err);
      }
    },
    [
      currentCvId,
      conversationId,
      sendMessageMutation,
      mapGqlMessage,
    ]
  );

  // Accept a proposed action
  const acceptAction = useCallback(
    async (messageId: string, actionId: string) => {
      if (!currentCvId) return;

      try {
        setError(null);
        const { data } = await respondToActionMutation({
          variables: {
            input: {
              messageId,
              actionId,
              accept: true,
            },
          },
          refetchQueries: [
            refetchGetCvQuery({ cvId: currentCvId }),
            refetchGetWorkExperienceEntriesQuery({ cvId: currentCvId }),
            refetchGetEducationEntriesQuery({ cvId: currentCvId }),
            refetchGetProjectEntriesQuery({ cvId: currentCvId }),
            refetchGetSkillEntriesQuery({ cvId: currentCvId }),
            refetchGetContactInfoEntriesQuery({ cvId: currentCvId }),
            refetchGetAboutMeQuery({ cvId: currentCvId }),
            refetchGetNameQuery({ cvId: currentCvId }),
          ],
        });

        if (data?.respondToProposedAction) {
          // Update local state
          setMessages((prev) =>
            prev.map((message) => {
              if (message._id === messageId) {
                return {
                  ...message,
                  proposedActions: message.proposedActions.map((action) =>
                    action._id === actionId
                      ? { ...action, status: 'accepted' as const }
                      : action
                  ),
                };
              }
              return message;
            })
          );

          toast.success('Change applied successfully');
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to accept action');
        setError(error);
        toast.error(error.message);
        console.error('Failed to accept action:', err);
      }
    },
    [respondToActionMutation, currentCvId]
  );

  // Reject a proposed action
  const rejectAction = useCallback(
    async (messageId: string, actionId: string) => {
      try {
        setError(null);
        const { data } = await respondToActionMutation({
          variables: {
            input: {
              messageId,
              actionId,
              accept: false,
            },
          },
        });

        if (data?.respondToProposedAction) {
          // Update local state
          setMessages((prev) =>
            prev.map((message) => {
              if (message._id === messageId) {
                return {
                  ...message,
                  proposedActions: message.proposedActions.map((action) =>
                    action._id === actionId
                      ? { ...action, status: 'rejected' as const }
                      : action
                  ),
                };
              }
              return message;
            })
          );
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to reject action');
        setError(error);
        toast.error(error.message);
        console.error('Failed to reject action:', err);
      }
    },
    [respondToActionMutation]
  );

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setError(null);
      await clearConversationMutation({
        variables: { conversationId },
      });

      setMessages([]);
      setConversationId(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to clear conversation');
      setError(error);
      toast.error(error.message);
      console.error('Failed to clear conversation:', err);
    }
  }, [conversationId, clearConversationMutation]);

  const value: ChatContextType = useMemo(
    () => ({
      messages,
      conversationId,
      isLoading,
      isSending,
      error,

      // Actions
      sendMessage,
      acceptAction,
      rejectAction,
      clearConversation,
      fetchMessages,

      // UI State
      setError,
    }),
    [
      messages,
      conversationId,
      isLoading,
      isSending,
      error,
      sendMessage,
      acceptAction,
      rejectAction,
      clearConversation,
      fetchMessages,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = use(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
