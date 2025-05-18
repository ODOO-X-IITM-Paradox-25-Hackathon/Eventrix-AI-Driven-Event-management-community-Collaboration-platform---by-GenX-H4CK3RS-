
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForumPost from "./ForumPost";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ForumPostType {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  tags: string[];
}

interface ForumInterfaceProps {
  eventId?: string;
}

const ForumInterface: React.FC<ForumInterfaceProps> = ({ eventId }) => {
  const [posts, setPosts] = useState<ForumPostType[]>([
    {
      id: "p1",
      title: "Welcome to our Tamil Nadu Event Series!",
      content: "We're excited to announce our new series of events across Tamil Nadu. Join us for cultural experiences, tech meetups, and networking opportunities in Chennai, Coimbatore, Madurai, and more!",
      author: "EventOrganizer",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      likes: 24,
      replies: 8,
      category: "Announcement",
      tags: ["welcome", "announcement", "tamilnadu"]
    },
    {
      id: "p2",
      title: "Best places to stay near the Madurai venue?",
      content: "I'm traveling from Bangalore for the Madurai event and looking for accommodation recommendations near the venue. Any suggestions for budget-friendly options with good reviews?",
      author: "Traveler123",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      likes: 7,
      replies: 12,
      category: "Question",
      tags: ["accommodation", "madurai", "travel"]
    },
    {
      id: "p3",
      title: "Tech opportunities in Tamil Nadu - Discussion",
      content: "Let's discuss the growing tech scene in Tamil Nadu. With IT parks in Chennai, Coimbatore and emerging opportunities in smaller cities, what are your thoughts on the future of tech jobs and startups in the region?",
      author: "TechEnthusiast",
      timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      likes: 15,
      replies: 5,
      category: "Discussion",
      tags: ["technology", "careers", "startups"]
    }
  ]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Discussion",
    tags: ""
  });
  const [selectedPost, setSelectedPost] = useState<ForumPostType | null>(null);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isViewPostOpen, setIsViewPostOpen] = useState(false);
  
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const post: ForumPostType = {
      id: `p${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      author: "You",
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      category: newPost.category,
      tags: newPost.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost({
      title: "",
      content: "",
      category: "Discussion",
      tags: ""
    });
    
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published to the forum."
    });
  };

  const handleViewPost = (post: ForumPostType) => {
    setSelectedPost(post);
    setIsViewPostOpen(true);
  };

  const filteredPosts = posts.filter(post => {
    // Filter by category
    if (activeCategory !== "all" && post.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && 
       !(post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Search forum posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogTrigger asChild>
            <Button className="bg-eventrix hover:bg-eventrix-hover">Create New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Forum Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or information with other event attendees.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newPost.category}
                  onValueChange={(value) => setNewPost({...newPost, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Discussion">Discussion</SelectItem>
                    <SelectItem value="Question">Question</SelectItem>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Resource">Resource</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content here..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  placeholder="event, question, tamilnadu"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleCreatePost}
                className="bg-eventrix hover:bg-eventrix-hover"
                disabled={!newPost.title.trim() || !newPost.content.trim()}
              >
                Publish Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Post Dialog */}
        <Dialog open={isViewPostOpen} onOpenChange={setIsViewPostOpen}>
          <DialogContent className="max-w-3xl">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle>{selectedPost.title}</DialogTitle>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {selectedPost.category}
                    </span>
                  </div>
                </DialogHeader>
                
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedPost.author}`} />
                    <AvatarFallback>{selectedPost.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedPost.author}</p>
                    <p className="text-xs text-gray-500">
                      {selectedPost.timestamp.toLocaleDateString()} at {selectedPost.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="my-4">
                  <p className="whitespace-pre-line">{selectedPost.content}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {selectedPost.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-2">Replies</h4>
                  <p className="text-gray-500 text-center py-4">
                    Forum replies are simulated in this demo.
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="discussion">Discussions</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <ForumPost
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              timestamp={post.timestamp}
              likes={post.likes}
              replies={post.replies}
              category={post.category}
              tags={post.tags}
              onClick={() => handleViewPost(post)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 
              "No posts found matching your search or filter." : 
              "No posts yet. Start the conversation!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumInterface;
