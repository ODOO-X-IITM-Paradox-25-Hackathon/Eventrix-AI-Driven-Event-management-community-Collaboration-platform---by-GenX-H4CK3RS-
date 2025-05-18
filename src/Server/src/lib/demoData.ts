
import { Event, User } from '../types';

// Generate placeholder image URLs
const getEventImage = (id: number) => {
  const imageIds = [
    "photo-1549451371-64aa98a6f660",
    "photo-1501281668745-f7f57925c3b4",
    "photo-1492684223066-81342ee5ff30",
    "photo-1429962714451-bb934ecdc4ec",
    "photo-1531058020387-3be344556be6",
    "photo-1511795409834-432d85671333",
    "photo-1472653431158-6364773b2a56",
    "photo-1540575467063-178a50c2df87",
    "photo-1523580494863-6f3031224c94",
    "photo-1523580846011-d3a5bc25702b"
  ];
  return `https://images.unsplash.com/${imageIds[id % imageIds.length]}?auto=format&fit=crop&w=800&h=400`;
};

// Demo users data
export const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "aarav@example.com",
    name: "Aarav Kumar",
    profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=aaravkumar"
  },
  {
    id: "2",
    email: "priya@example.com",
    name: "Priya Singh",
    profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=priyasingh"
  },
  {
    id: "3",
    email: "vikram@example.com",
    name: "Vikram Nair",
    profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=vikramnair"
  },
  {
    id: "4",
    email: "deepa@example.com",
    name: "Deepa Venkat",
    profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=deepavenkat"
  },
  {
    id: "5",
    email: "arjun@example.com",
    name: "Arjun Reddy",
    profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=arjunreddy"
  }
];

// Demo event data with categories/tags
export const DEMO_EVENTS: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2023",
    description: "Join us for the biggest tech conference of the year featuring keynotes from industry leaders, workshops on cutting-edge technologies, and networking opportunities with top professionals.",
    image: getEventImage(0),
    location: "Chennai Trade Centre, Mount Poonamallee Rd, Chennai",
    startTime: "2023-11-15T09:00:00",
    endTime: "2023-11-17T18:00:00",
    registrationStart: "2023-09-01T00:00:00",
    registrationEnd: "2023-11-10T23:59:59",
    createdBy: "1",
    createdAt: "2023-08-15T14:22:00",
    category: "tech",
    tags: ["conference", "networking", "innovation"]
  },
  {
    id: "2",
    name: "Music Festival",
    description: "Experience three days of incredible live music across five stages featuring top artists and emerging talents in a beautiful outdoor setting with food vendors and art installations.",
    image: getEventImage(1),
    location: "Marina Beach Road, Triplicane, Chennai",
    startTime: "2023-12-03T12:00:00",
    endTime: "2023-12-05T23:00:00",
    registrationStart: "2023-10-01T00:00:00",
    registrationEnd: "2023-12-01T23:59:59",
    createdBy: "2",
    createdAt: "2023-09-20T09:15:00",
    category: "cultural",
    tags: ["music", "festival", "arts"]
  },
  {
    id: "3",
    name: "Startup Networking Mixer",
    description: "Connect with founders, investors, and industry professionals at our monthly networking event designed to help startups grow and find potential partners.",
    image: getEventImage(2),
    location: "Tidel Park, Taramani, Chennai",
    startTime: "2023-11-10T18:30:00",
    endTime: "2023-11-10T21:30:00",
    registrationStart: "2023-10-15T00:00:00",
    registrationEnd: "2023-11-09T23:59:59",
    createdBy: "1",
    createdAt: "2023-10-01T11:45:00",
    category: "tech",
    tags: ["startup", "networking", "business"]
  },
  {
    id: "4",
    name: "Art Exhibition: Modern Perspectives",
    description: "Explore contemporary art through the eyes of emerging artists pushing boundaries and challenging traditional concepts in this curated exhibition featuring paintings, sculptures, and interactive installations.",
    image: getEventImage(3),
    location: "Government Museum, Pantheon Road, Egmore, Chennai",
    startTime: "2023-11-20T10:00:00",
    endTime: "2023-12-15T17:00:00",
    registrationStart: "2023-10-20T00:00:00",
    registrationEnd: "2023-12-14T23:59:59",
    createdBy: "3",
    createdAt: "2023-09-30T16:20:00",
    category: "cultural",
    tags: ["art", "exhibition", "culture"]
  },
  {
    id: "5",
    name: "Wellness Retreat Weekend",
    description: "Rejuvenate your body and mind with a weekend of yoga, meditation, nutritious meals, and workshops focused on mental health and physical wellness in a peaceful natural setting.",
    image: getEventImage(4),
    location: "Mahabalipuram Beach Resort, East Coast Road, Mahabalipuram",
    startTime: "2023-12-08T15:00:00",
    endTime: "2023-12-10T14:00:00",
    registrationStart: "2023-10-15T00:00:00",
    registrationEnd: "2023-12-01T23:59:59",
    createdBy: "4",
    createdAt: "2023-10-05T08:30:00",
    category: "wellness",
    tags: ["yoga", "meditation", "health"]
  },
  {
    id: "6",
    name: "Culinary Workshop: International Cuisine",
    description: "Learn to prepare authentic dishes from around the world with guidance from expert chefs. Includes hands-on cooking sessions, tasting, and a recipe book to take home.",
    image: getEventImage(5),
    location: "Taj Coromandel, Nungambakkam High Road, Chennai",
    startTime: "2023-11-25T10:00:00",
    endTime: "2023-11-25T15:00:00",
    registrationStart: "2023-10-25T00:00:00",
    registrationEnd: "2023-11-24T12:00:00",
    createdBy: "5",
    createdAt: "2023-10-15T14:00:00",
    category: "cultural",
    tags: ["cooking", "workshop", "food"]
  },
  {
    id: "7",
    name: "AI and Machine Learning Workshop",
    description: "Hands-on workshop covering the latest advancements in AI and machine learning. Learn practical skills in implementing ML algorithms and building AI-powered applications.",
    image: getEventImage(6),
    location: "IIT Madras Research Park, Taramani, Chennai",
    startTime: "2023-12-15T09:00:00",
    endTime: "2023-12-15T17:00:00",
    registrationStart: "2023-11-01T00:00:00",
    registrationEnd: "2023-12-10T23:59:59",
    createdBy: "1",
    createdAt: "2023-10-25T10:30:00",
    category: "tech",
    tags: ["AI", "machine learning", "workshop"]
  },
  {
    id: "8",
    name: "Cybersecurity Summit",
    description: "Annual cybersecurity summit featuring discussions on emerging threats, defense strategies, and the latest security technologies with experts from around the world.",
    image: getEventImage(7),
    location: "Phoenix Marketcity, Velachery Main Road, Chennai",
    startTime: "2023-12-20T10:00:00",
    endTime: "2023-12-21T16:00:00",
    registrationStart: "2023-11-05T00:00:00",
    registrationEnd: "2023-12-15T23:59:59",
    createdBy: "3",
    createdAt: "2023-10-30T15:45:00",
    category: "tech",
    tags: ["cybersecurity", "infosec", "tech summit"]
  },
  {
    id: "9",
    name: "Beach Cleanup Drive",
    description: "Join our community effort to clean up Marina Beach and raise awareness about marine pollution. All supplies provided and refreshments served after the cleanup.",
    image: getEventImage(8),
    location: "Marina Beach, Chennai",
    startTime: "2023-11-18T07:00:00",
    endTime: "2023-11-18T11:00:00",
    registrationStart: "2023-10-18T00:00:00",
    registrationEnd: "2023-11-17T18:00:00",
    createdBy: "4",
    createdAt: "2023-10-15T09:00:00",
    category: "outdoor",
    tags: ["environmental", "community", "volunteer"]
  },
  {
    id: "10",
    name: "Web3 & Blockchain Conference",
    description: "Explore the future of the internet with in-depth sessions on blockchain technology, cryptocurrencies, NFTs, DAOs, and more with industry pioneers.",
    image: getEventImage(9),
    location: "Anna Centenary Library, Kotturpuram, Chennai",
    startTime: "2024-01-10T09:30:00",
    endTime: "2024-01-11T17:00:00",
    registrationStart: "2023-11-10T00:00:00",
    registrationEnd: "2024-01-05T23:59:59",
    createdBy: "2",
    createdAt: "2023-11-01T13:20:00",
    category: "tech",
    tags: ["blockchain", "crypto", "web3"]
  }
];

// Demo registered events for the current user
export const USER_REGISTERED_EVENTS = ["1", "3", "5", "7"];

// Demo events created by the current user
export const USER_CREATED_EVENTS = ["2", "4", "9"];

// Function to check if user is registered for an event
export const isUserRegistered = (eventId: string) => {
  return USER_REGISTERED_EVENTS.includes(eventId);
};

// Function to check if user created an event
export const isUserCreator = (eventId: string) => {
  return USER_CREATED_EVENTS.includes(eventId);
};

// Function to get all events
export const getAllEvents = () => {
  return DEMO_EVENTS;
};

// Function to get all categories
export const getAllCategories = () => {
  const categories = [...new Set(DEMO_EVENTS.map(event => event.category))];
  return categories;
};

// Function to get event by ID
export const getEventById = (eventId: string) => {
  return DEMO_EVENTS.find(event => event.id === eventId);
};

// Function to get user's registered events
export const getUserRegisteredEvents = () => {
  return DEMO_EVENTS.filter(event => USER_REGISTERED_EVENTS.includes(event.id));
};

// Function to get user's created events
export const getUserCreatedEvents = () => {
  return DEMO_EVENTS.filter(event => USER_CREATED_EVENTS.includes(event.id));
};

// Function to search events
export const searchEvents = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return DEMO_EVENTS.filter(event => 
    event.name.toLowerCase().includes(lowercaseQuery) || 
    event.description.toLowerCase().includes(lowercaseQuery) ||
    event.location.toLowerCase().includes(lowercaseQuery) ||
    event.category.toLowerCase().includes(lowercaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Function to filter events by category
export const filterByCategory = (category: string) => {
  if (!category || category === 'all') {
    return DEMO_EVENTS;
  }
  return DEMO_EVENTS.filter(event => event.category.toLowerCase() === category.toLowerCase());
};

// Get a user by their ID
export const getUserById = (userId: string) => {
  return DEMO_USERS.find(user => user.id === userId);
};
