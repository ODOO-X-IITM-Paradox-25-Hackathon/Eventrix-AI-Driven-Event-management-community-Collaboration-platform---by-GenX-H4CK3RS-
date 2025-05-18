
import React from "react";
import { Progress } from "@/components/ui/progress";

interface PollOptionProps {
  id: string;
  text: string;
  votes: number;
  totalVotes: number;
  selected: boolean;
  onVote: (id: string) => void;
  hasVoted: boolean;
}

const PollOption: React.FC<PollOptionProps> = ({
  id,
  text,
  votes,
  totalVotes,
  selected,
  onVote,
  hasVoted
}) => {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  return (
    <div 
      className={`
        mb-3 p-3 rounded-lg border transition-all
        ${selected ? 'border-eventrix bg-eventrix/5 dark:border-eventrix-light dark:bg-eventrix-dark/10' : 'border-gray-200 dark:border-gray-700'}
        ${!hasVoted && 'hover:border-eventrix dark:hover:border-eventrix-light cursor-pointer'}
      `}
      onClick={() => !hasVoted && onVote(id)}
    >
      <div className="flex justify-between mb-1">
        <div className="font-medium dark:text-gray-200">{text}</div>
        {hasVoted && (
          <div className="text-sm font-medium dark:text-gray-300">
            {votes} vote{votes !== 1 ? 's' : ''} ({percentage}%)
          </div>
        )}
      </div>
      
      {hasVoted && (
        <Progress value={percentage} className="h-2" />
      )}
    </div>
  );
};

export default PollOption;
