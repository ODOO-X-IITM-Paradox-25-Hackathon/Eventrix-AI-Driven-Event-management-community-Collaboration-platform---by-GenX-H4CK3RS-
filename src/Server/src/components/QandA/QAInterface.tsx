
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionItem from "./QuestionItem";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  likes: number;
  answers: {
    id: string;
    text: string;
    author: string;
    timestamp: Date;
    isOfficial?: boolean;
  }[];
  isAnswered: boolean;
}

interface QAInterfaceProps {
  eventId?: string;
}

const QAInterface: React.FC<QAInterfaceProps> = ({ eventId }) => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      text: "Is there parking available near the venue in Coimbatore?",
      author: "Ravi Kumar",
      timestamp: new Date(Date.now() - 8600000),
      likes: 12,
      answers: [
        {
          id: "a1",
          text: "Yes, there's a large parking structure adjacent to the venue. It costs ₹50 per hour.",
          author: "EventOrganizer",
          timestamp: new Date(Date.now() - 5400000),
          isOfficial: true
        },
        {
          id: "a2",
          text: "I found good street parking about 2 blocks away that's free after 6pm.",
          author: "Priya S",
          timestamp: new Date(Date.now() - 3200000)
        }
      ],
      isAnswered: true
    },
    {
      id: "q2",
      text: "Will the presentations be available after the event for those who couldn't attend certain sessions?",
      author: "Anand Sharma",
      timestamp: new Date(Date.now() - 7200000),
      likes: 8,
      answers: [],
      isAnswered: false
    },
    {
      id: "q3",
      text: "Are there vegetarian food options available at the event in Chennai?",
      author: "Meena Venkat",
      timestamp: new Date(Date.now() - 5400000),
      likes: 5,
      answers: [
        {
          id: "a3",
          text: "Yes, there will be plenty of vegetarian options including South Indian specialties!",
          author: "EventOrganizer",
          timestamp: new Date(Date.now() - 3600000),
          isOfficial: true
        }
      ],
      isAnswered: true
    }
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const question: Question = {
      id: `q${Date.now()}`,
      text: newQuestion,
      author: "You",
      timestamp: new Date(),
      likes: 0,
      answers: [],
      isAnswered: false
    };
    
    setQuestions(prev => [question, ...prev]);
    setNewQuestion("");
    
    toast({
      title: "Question submitted",
      description: "Your question has been posted successfully."
    });
  };

  const handleLike = (id: string) => {
    if (userLiked[id]) {
      setQuestions(prev => prev.map(q => 
        q.id === id ? {...q, likes: q.likes - 1} : q
      ));
      setUserLiked(prev => ({...prev, [id]: false}));
    } else {
      setQuestions(prev => prev.map(q => 
        q.id === id ? {...q, likes: q.likes + 1} : q
      ));
      setUserLiked(prev => ({...prev, [id]: true}));
      
      toast({
        title: "Question liked",
        description: "You've liked this question"
      });
    }
  };

  const filteredQuestions = questions.filter(question => {
    // Filter based on search query
    if (searchQuery && !question.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter based on active tab
    if (activeTab === "answered" && !question.isAnswered) {
      return false;
    }
    if (activeTab === "unanswered" && question.isAnswered) {
      return false;
    }
    
    return true;
  });

  // Sort questions: most recent first, but with unanswered official questions first
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (!a.isAnswered && b.isAnswered) return -1;
    if (a.isAnswered && !b.isAnswered) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questions & Answers</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-eventrix hover:bg-eventrix-hover">Ask a Question</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Your question will be visible to all event attendees and organizers.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="What would you like to know?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button 
                onClick={handleAddQuestion} 
                className="bg-eventrix hover:bg-eventrix-hover"
                disabled={!newQuestion.trim()}
              >
                Submit Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:max-w-xs grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map(question => (
            <QuestionItem
              key={question.id}
              id={question.id}
              text={question.text}
              author={question.author}
              timestamp={question.timestamp}
              likes={question.likes}
              answers={question.answers}
              onLike={handleLike}
              userLiked={!!userLiked[question.id]}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 
              "No questions found matching your search." : 
              "No questions yet. Be the first to ask!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default QAInterface;
