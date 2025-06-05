
import { Event } from '../types';

const EVENTS_STORAGE_KEY = 'eventrix_events';

// Get demo events (existing ones)
import { getAllEvents as getDemoEvents } from './demoData';

export const getAllStoredEvents = (): Event[] => {
  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    const userEvents = storedEvents ? JSON.parse(storedEvents) : [];
    const demoEvents = getDemoEvents();
    
    // Combine demo events with user-created events
    return [...demoEvents, ...userEvents];
  } catch (error) {
    console.error('Error getting stored events:', error);
    return getDemoEvents();
  }
};

export const saveEvent = (event: Event): void => {
  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    events.push(event);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const searchStoredEvents = (query: string): Event[] => {
  const allEvents = getAllStoredEvents();
  
  if (!query.trim()) {
    return allEvents;
  }
  
  const searchTerm = query.toLowerCase();
  return allEvents.filter(event => {
    // Safely handle string fields
    const nameMatch = event.name && typeof event.name === 'string' && event.name.toLowerCase().includes(searchTerm);
    const descMatch = event.description && typeof event.description === 'string' && event.description.toLowerCase().includes(searchTerm);
    const locationMatch = event.location && typeof event.location === 'string' && event.location.toLowerCase().includes(searchTerm);
    const categoryMatch = event.category && typeof event.category === 'string' && event.category.toLowerCase().includes(searchTerm);
    
    // Safely handle tags array - ensure each tag is a string before calling toLowerCase
    const tagMatch = event.tags && Array.isArray(event.tags) && 
      event.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(searchTerm));
    
    return nameMatch || descMatch || locationMatch || categoryMatch || tagMatch;
  });
};

export const filterStoredEventsByCategory = (category: string): Event[] => {
  const allEvents = getAllStoredEvents();
  
  if (category === 'all') {
    return allEvents;
  }
  
  return allEvents.filter(event => 
    event.category && typeof event.category === 'string' && 
    event.category.toLowerCase() === category.toLowerCase()
  );
};

// Add new tech events with hackathons
export const addTechHackathons = () => {
  const hackathons = [
    {
      id: 'hack1',
      name: 'AI Innovation Hackathon 2024',
      description: 'Build the next generation of AI-powered applications. 48 hours of coding, learning, and innovation.',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      location: 'Tech Hub, Bangalore',
      category: 'tech',
      tags: ['hackathon', 'AI', 'coding', 'innovation'],
      image: '/placeholder.svg',
      organizer: 'Tech Community'
    },
    {
      id: 'hack2',
      name: 'Blockchain Builders Hackathon',
      description: 'Create decentralized solutions that matter. Focus on real-world blockchain applications.',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days from now
      location: 'Innovation Center, Mumbai',
      category: 'tech',
      tags: ['hackathon', 'blockchain', 'web3', 'decentralized'],
      image: '/placeholder.svg',
      organizer: 'Blockchain Society'
    }
  ];

  const existingEvents = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
  const newEvents = [...existingEvents, ...hackathons];
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
};

// Add emergency healthcare events
export const addEmergencyHealthcareEvents = () => {
  const healthcareEvents = [
    {
      id: 'emergency1',
      name: 'Blood Donation Drive - Critical Need',
      description: 'URGENT: Critical shortage of O- blood type. Immediate donations needed for emergency surgeries.',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
      location: 'City Hospital, Emergency Wing',
      category: 'emergency',
      tags: ['urgent', 'blood-donation', 'healthcare', 'emergency'],
      image: '/placeholder.svg',
      organizer: 'City Hospital'
    },
    {
      id: 'emergency2',
      name: 'Free Medical Camp - Flood Relief',
      description: 'Emergency medical assistance for flood-affected families. Free checkups, medicines, and first aid.',
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      location: 'Relief Camp, Riverside Area',
      category: 'emergency',
      tags: ['urgent', 'medical-camp', 'flood-relief', 'healthcare'],
      image: '/placeholder.svg',
      organizer: 'Red Cross Society'
    }
  ];

  const existingEvents = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
  const newEvents = [...existingEvents, ...healthcareEvents];
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
  
  // Mark as emergency events
  const emergencyEvents = JSON.parse(localStorage.getItem('emergencyEvents') || '[]');
  emergencyEvents.push('emergency1', 'emergency2');
  localStorage.setItem('emergencyEvents', JSON.stringify(emergencyEvents));
};

// Add lost and found posts
export const addLostAndFoundPosts = () => {
  const lostFoundPosts = [
    {
      id: 'lost1',
      name: 'Lost Golden Retriever - Max',
      description: 'URGENT: Lost golden retriever named Max. Last seen near Central Park. Wearing blue collar with tag. Very friendly, please call if found!',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      endTime: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22 hours from now (24hr window)
      location: 'Central Park Area',
      category: 'lost & found',
      tags: ['lost-pet', 'dog', 'golden-retriever', 'urgent'],
      image: '/placeholder.svg',
      organizer: 'Pet Owner'
    },
    {
      id: 'lost2',
      name: 'Found Wallet with ID Cards',
      description: 'Found a brown leather wallet with ID cards and credit cards. Contains driver license for John Smith. Please contact to claim.',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      endTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(), // 23 hours from now
      location: 'Mall Food Court',
      category: 'lost & found',
      tags: ['found-wallet', 'identification', 'urgent'],
      image: '/placeholder.svg',
      organizer: 'Good Samaritan'
    },
    {
      id: 'lost3',
      name: 'Lost Car Keys - Honda Civic',
      description: 'Lost Honda Civic car keys with remote and house keys attached. Blue keychain with "Home Sweet Home" tag. Reward offered!',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      endTime: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(), // 23.5 hours from now
      location: 'Shopping Center Parking',
      category: 'lost & found',
      tags: ['lost-keys', 'car-keys', 'urgent'],
      image: '/placeholder.svg',
      organizer: 'Desperate Driver'
    }
  ];

  const existingEvents = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
  const newEvents = [...existingEvents, ...lostFoundPosts];
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
  
  // Mark as lost & found events
  const lostFoundEvents = JSON.parse(localStorage.getItem('lostFoundEvents') || '[]');
  lostFoundEvents.push('lost1', 'lost2', 'lost3');
  localStorage.setItem('lostFoundEvents', JSON.stringify(lostFoundEvents));
};

// Update specific event timings and payment statuses
export const updateSpecificEventDetails = () => {
  // Set specific events as paid and registered with payment pending
  const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
  const paidEvents = JSON.parse(localStorage.getItem('paidEvents') || '[]');
  
  // Startup Networking Mixer - registered but payment pending
  if (!registeredEvents.includes('8')) {
    registeredEvents.push('8');
  }
  
  // Art Exhibition - registered but unpaid
  if (!registeredEvents.includes('9')) {
    registeredEvents.push('9');
  }
  
  localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
  localStorage.setItem('paidEvents', JSON.stringify(paidEvents));
  
  // Update demo event timings for specific events with FUTURE dates
  const updatedEvents = [
    {
      id: 'tech-conference-2024',
      name: 'Tech Conference 2024',
      description: 'Annual technology conference featuring the latest in AI, blockchain, and web development.',
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
      location: 'Convention Center',
      category: 'tech',
      tags: ['technology', 'conference', 'AI', 'blockchain'],
      image: '/placeholder.svg',
      organizer: 'Tech Organizers'
    },
    {
      id: 'summer-music-festival-2024',
      name: 'Summer Music Festival 2024',
      description: 'Three-day music festival featuring local and international artists.',
      startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      location: 'Central Park',
      category: 'cultural',
      tags: ['music', 'festival', 'entertainment'],
      image: '/placeholder.svg',
      organizer: 'Music Events Ltd'
    },
    {
      id: 'startup-networking-mixer-2024',
      name: 'Startup Networking Mixer',
      description: 'Network with fellow entrepreneurs and investors in a casual setting.',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 3 days + 4 hours from now
      location: 'Innovation Hub',
      category: 'tech',
      tags: ['startup', 'networking', 'entrepreneurs'],
      image: '/placeholder.svg',
      organizer: 'Startup Community'
    }
  ];

  const existingEvents = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
  const newEvents = [...existingEvents, ...updatedEvents];
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
};

// Initialize new event types
export const initializeNewEventTypes = () => {
  addTechHackathons();
  addEmergencyHealthcareEvents();
  addLostAndFoundPosts();
  updateSpecificEventDetails();
};
