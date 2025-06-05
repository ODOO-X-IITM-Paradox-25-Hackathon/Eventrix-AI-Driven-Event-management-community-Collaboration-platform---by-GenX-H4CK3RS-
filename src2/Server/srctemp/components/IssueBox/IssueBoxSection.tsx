
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Search, Filter, Heart, ThumbsUp } from 'lucide-react';
import { Issue, IssueFilters } from './types';
import { getStoredIssues, saveIssue, searchIssues, sortIssues, getIssuesByDistance } from './utils';
import IssueCard from './IssueCard';
import CreateIssueModal from './CreateIssueModal';
import IssueDetailModal from './IssueDetailModal';
import { useToast } from '@/hooks/use-toast';

const IssueBoxSection: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({
    category: 'all',
    status: 'all',
    distance: 'all',
    sortBy: 'recent'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, searchQuery, filters]);

  const loadIssues = () => {
    const storedIssues = getStoredIssues();
    setIssues(storedIssues);
  };

  const applyFilters = () => {
    let filtered = issues;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchIssues(searchQuery);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(issue => issue.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(issue => issue.status === filters.status);
    }

    // Apply distance filter
    if (filters.distance !== 'all') {
      filtered = getIssuesByDistance(filters.distance).filter(issue => 
        filtered.some(f => f.id === issue.id)
      );
    }

    // Apply special sorting for recently liked and recently voted
    if (filters.sortBy === 'recently-liked') {
      const likedIssues = JSON.parse(localStorage.getItem('likedIssues') || '[]');
      filtered = filtered.filter(issue => likedIssues.includes(issue.id));
      // Sort by when they were liked (most recent first)
      filtered.sort((a, b) => {
        const aIndex = likedIssues.indexOf(a.id);
        const bIndex = likedIssues.indexOf(b.id);
        return aIndex - bIndex;
      });
    } else if (filters.sortBy === 'recently-voted') {
      const votedIssues = JSON.parse(localStorage.getItem('votedIssues') || '[]');
      filtered = filtered.filter(issue => votedIssues.includes(issue.id));
      // Sort by when they were voted (most recent first)
      filtered.sort((a, b) => {
        const aIndex = votedIssues.indexOf(a.id);
        const bIndex = votedIssues.indexOf(b.id);
        return aIndex - bIndex;
      });
    } else {
      // Apply normal sorting
      filtered = sortIssues(filtered, filters.sortBy);
    }

    setFilteredIssues(filtered);
  };

  const handleCreateIssue = (newIssue: Issue) => {
    saveIssue(newIssue);
    loadIssues();
  };

  const handleVoteIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      const votedIssues = JSON.parse(localStorage.getItem('votedIssues') || '[]');
      if (votedIssues.includes(issueId)) {
        toast({
          title: "Already Voted",
          description: "You have already voted on this issue",
          variant: "destructive"
        });
        return;
      }

      const updatedIssue = { ...issue, votes: issue.votes + 1 };
      saveIssue(updatedIssue);
      
      votedIssues.unshift(issueId); // Add to beginning for "most recent" order
      localStorage.setItem('votedIssues', JSON.stringify(votedIssues));
      
      loadIssues();
      toast({
        title: "Vote Recorded",
        description: "Thank you for supporting this issue"
      });
      
      // Trigger re-render if we're currently viewing voted issues
      if (filters.sortBy === 'recently-voted') {
        applyFilters();
      }
    }
  };

  const handleLikeIssue = (issueId: string) => {
    const likedIssues = JSON.parse(localStorage.getItem('likedIssues') || '[]');
    
    if (likedIssues.includes(issueId)) {
      // Unlike the issue
      const updatedLiked = likedIssues.filter((id: string) => id !== issueId);
      localStorage.setItem('likedIssues', JSON.stringify(updatedLiked));
      toast({
        title: "Issue Unliked",
        description: "Issue removed from your liked list"
      });
    } else {
      // Like the issue
      likedIssues.unshift(issueId); // Add to beginning for "most recent" order
      localStorage.setItem('likedIssues', JSON.stringify(likedIssues));
      toast({
        title: "Issue Liked",
        description: "Issue added to your liked list"
      });
    }
    
    // Trigger re-render if we're currently viewing liked issues
    if (filters.sortBy === 'recently-liked') {
      applyFilters();
    }
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Community Issues Portal
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Report and track community issues around IITM Chennai to help improve our neighborhood
        </p>
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          📍 Source Location: IIT Madras Campus, Chennai
        </div>
      </div>

      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {filteredIssues.length} Issues Found
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700">
            Near IITM Campus
          </Badge>
          {filters.sortBy === 'recently-liked' && (
            <Badge variant="outline" className="px-3 py-1 bg-pink-50 text-pink-700">
              <Heart className="h-3 w-3 mr-1" />
              Liked Issues
            </Badge>
          )}
          {filters.sortBy === 'recently-voted' && (
            <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Voted Issues
            </Badge>
          )}
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="road">🛣️ Road Issues</SelectItem>
                <SelectItem value="electricity">⚡ Electricity</SelectItem>
                <SelectItem value="garbage">🗑️ Garbage</SelectItem>
                <SelectItem value="water">💧 Water</SelectItem>
                <SelectItem value="infrastructure">🏗️ Infrastructure</SelectItem>
                <SelectItem value="other">📋 Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reported">🔴 Reported</SelectItem>
                <SelectItem value="in-progress">🟡 In Progress</SelectItem>
                <SelectItem value="resolved">🟢 Resolved</SelectItem>
                <SelectItem value="closed">⚫ Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.distance} onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Distance from IITM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="1">📍 Within 1km</SelectItem>
                <SelectItem value="3">🚶 Within 3km</SelectItem>
                <SelectItem value="5">🚴 Within 5km</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as IssueFilters['sortBy'] }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="upvoted">Most Upvoted</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="recently-liked">
                  <div className="flex items-center gap-2">
                    <Heart className="h-3 w-3" />
                    Recently Liked
                  </div>
                </SelectItem>
                <SelectItem value="recently-voted">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-3 w-3" />
                    Recently Voted
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onVote={handleVoteIssue}
            onView={handleViewIssue}
            onLike={handleLikeIssue}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Issues Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchQuery || filters.category !== 'all' || filters.status !== 'all' || filters.distance !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Be the first to report a community issue around IITM'}
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            Report First Issue
          </Button>
        </div>
      )}

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIssue}
      />

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIssue(null);
        }}
        onVote={handleVoteIssue}
      />
    </div>
  );
};

export default IssueBoxSection;
