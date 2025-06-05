
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  startTime: string;
  endTime: string;
  registrationStart: string;
  registrationEnd: string;
  createdBy: string;
  createdAt: string;
  category: string;
  tags: string[];
  upvotes?: number;
  totalViews?: number;
  followers?: number;
  speaker?: string;
  organizer?: EventOrganizer;
  sponsors?: Sponsor[];
  attendees?: Attendee[];
  feedback?: EventFeedback[];
  rating?: number;
  activities?: EventActivity[];
}

export interface EventOrganizer {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface Attendee {
  userId: string;
  name: string;
  email: string;
  registeredAt: string;
  guests: number;
  loginActivity?: LoginActivity[];
}

export interface LoginActivity {
  date: string;
  action: string;
  ipAddress?: string;
}

export interface EventActivity {
  id: string;
  type: 'reminder' | 'update' | 'registration' | 'cancellation';
  description: string;
  date: string;
  userId?: string;
}

export interface EventFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  category: 'organization' | 'content' | 'venue' | 'speaker';
  date: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}
