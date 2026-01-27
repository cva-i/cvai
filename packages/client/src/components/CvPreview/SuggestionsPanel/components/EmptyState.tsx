import React from 'react';
import { Lightbulb } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Lightbulb className="w-16 h-16 text-gray-300 mb-6 opacity-60" />
      <h6 className="text-base font-medium text-gray-500 mb-1">
        No suggestions available
      </h6>
      <p className="text-sm text-gray-400 max-w-[200px]">
        Click the refresh button to load demo suggestions
      </p>
    </div>
  );
};
