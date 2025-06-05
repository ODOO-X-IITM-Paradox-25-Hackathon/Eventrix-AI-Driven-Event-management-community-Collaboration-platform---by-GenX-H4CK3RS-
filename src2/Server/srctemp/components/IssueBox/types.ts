
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'road' | 'electricity' | 'garbage' | 'water' | 'infrastructure' | 'other';
  status: 'reported' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  distance: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  reportedBy: {
    name: string;
    id: string;
  };
  reportedDate: string;
  updatedDate: string;
  votes: number;
  images?: string[];
  contactInfo?: string;
  tags?: string[];
  estimatedResolutionTime?: string;
}

export interface IssueFilters {
  category: string;
  status: string;
  distance: string;
  sortBy: 'recent' | 'upvoted' | 'distance' | 'recently-liked' | 'recently-voted';
}
