
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
