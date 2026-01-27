import React, { useState } from 'react';
import { cn } from '@ui/lib/utils';
import { Button } from '@ui/components/ui/button';
import { Badge } from '@ui/components/ui/badge';
import {
  Check,
  X,
  Pencil,
  Plus,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';
import type { ProposedAction } from '../../../contexts/use-chat/types';

interface ActionBubbleProps {
  action: ProposedAction;
  messageId: string;
  onAccept: (messageId: string, actionId: string) => void;
  onReject: (messageId: string, actionId: string) => void;
}

const getActionIcon = (type: ProposedAction['type']) => {
  switch (type) {
    case 'update_field':
      return <Pencil className="h-4 w-4" />;
    case 'add_entry':
      return <Plus className="h-4 w-4" />;
    case 'delete_entry':
      return <Trash2 className="h-4 w-4" />;
    case 'reorder_entries':
      return <ArrowUpDown className="h-4 w-4" />;
    case 'clarifying_question':
      return <HelpCircle className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

const getActionTypeLabel = (type: ProposedAction['type']) => {
  switch (type) {
    case 'update_field':
      return 'Update';
    case 'add_entry':
      return 'Add';
    case 'delete_entry':
      return 'Delete';
    case 'reorder_entries':
      return 'Reorder';
    case 'clarifying_question':
      return 'Question';
    default:
      return 'Action';
  }
};

export const ActionBubble: React.FC<ActionBubbleProps> = ({
  action,
  messageId,
  onAccept,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPending = action.status === 'pending';
  const isAccepted = action.status === 'accepted';
  const isRejected = action.status === 'rejected';

  return (
    <div
      className={cn(
        'mt-2 rounded-lg border p-3 transition-all',
        isPending && 'border-amber-200 bg-amber-50',
        isAccepted && 'border-green-200 bg-green-50',
        isRejected && 'border-red-200 bg-red-50 opacity-60'
      )}
    >
      <div className="flex items-start gap-2">
        <div
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
            isPending && 'bg-amber-200 text-amber-700',
            isAccepted && 'bg-green-200 text-green-700',
            isRejected && 'bg-red-200 text-red-700'
          )}
        >
          {getActionIcon(action.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                isPending && 'border-amber-300 text-amber-700',
                isAccepted && 'border-green-300 text-green-700',
                isRejected && 'border-red-300 text-red-700'
              )}
            >
              {getActionTypeLabel(action.type)}
            </Badge>
            {!isPending && (
              <Badge
                variant={isAccepted ? 'default' : 'destructive'}
                className="text-xs"
              >
                {isAccepted ? 'Applied' : 'Rejected'}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-700">{action.description}</p>

          {/* Expandable details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Show details
              </>
            )}
          </button>

          {isExpanded && (
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Action buttons for pending actions */}
      {isPending && action.type !== 'clarifying_question' && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(messageId, action._id)}
            className="h-7 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-3 w-3" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onAccept(messageId, action._id)}
            className="h-7 gap-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-3 w-3" />
            Apply
          </Button>
        </div>
      )}
    </div>
  );
};
