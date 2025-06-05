
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PollOption from "./PollOption";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PollData {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  createdAt: Date;
  endsAt?: Date;
}

interface PollInterfaceProps {
  eventId?: string;
}

const PollInterface: React.FC<PollInterfaceProps> = ({ eventId }) => {
  const [polls, setPolls] = useState<PollData[]>([
    {
      id: "poll1",
      question: "What are you most excited about for this event?",
      options: [
        { id: "opt1", text: "Networking opportunities", votes: 12 },
        { id: "opt2", text: "Learning new skills", votes: 18 },
        { id: "opt3", text: "Meeting the speakers", votes: 7 },
        { id: "opt4", text: "The venue in Tamil Nadu", votes: 9 }
      ],
      totalVotes: 46,
      createdAt: new Date(Date.now() - 86400000),
      endsAt: new Date(Date.now() + 3600000)
    },
    {
      id: "poll2",
      question: "Which session format do you prefer?",
      options: [
        { id: "opt1", text: "Panel discussions", votes: 8 },
        { id: "opt2", text: "Interactive workshops", votes: 15 },
        { id: "opt3", text: "Keynote presentations", votes: 5 },
        { id: "opt4", text: "Networking sessions", votes: 7 }
      ],
      totalVotes: 35,
      createdAt: new Date(Date.now() - 43200000)
    }
  ]);

  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSelectOption = (pollId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [pollId]: optionId }));
  };

  const handleVote = (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) return;

    setPolls(currentPolls => 
      currentPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === selectedOption) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });
          
          return { 
            ...poll, 
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1
          };
        }
        return poll;
      })
    );

    setUserVotes(prev => ({ ...prev, [pollId]: selectedOption }));
    
    toast({
      title: "Vote recorded",
      description: "Thank you for participating in the poll!"
    });
  };

  const formatTimeLeft = (endsAt?: Date): string => {
    if (!endsAt) return "No end time";
    
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    
    if (diff <= 0) return "Poll ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  return (
    <div className="space-y-6">
      {polls.map(poll => (
        <Card key={poll.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{poll.question}</CardTitle>
                <CardDescription>
                  {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              {poll.endsAt && (
                <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                  {formatTimeLeft(poll.endsAt)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {poll.options.map(option => (
              <PollOption
                key={option.id}
                id={option.id}
                text={option.text}
                votes={option.votes}
                totalVotes={poll.totalVotes}
                selected={selectedOptions[poll.id] === option.id}
                onVote={() => handleSelectOption(poll.id, option.id)}
                hasVoted={!!userVotes[poll.id]}
              />
            ))}
            
            {!userVotes[poll.id] && (
              <Button
                onClick={() => handleVote(poll.id)}
                className="w-full mt-2 bg-eventrix hover:bg-eventrix-hover"
                disabled={!selectedOptions[poll.id]}
              >
                Vote
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PollInterface;
