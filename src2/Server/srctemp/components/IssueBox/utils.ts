
import { Issue, IssueFilters } from './types';

const IITM_COORDINATES = { lat: 12.9915, lng: 80.2336 };

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

const generateDemoIssues = (): Issue[] => {
  const issues: Issue[] = [
    {
      id: 'issue_1',
      title: 'Streetlight not working',
      description: 'Multiple streetlights are not functioning on the main road near IIT Madras, making it dangerous for evening commuters and students.',
      category: 'electricity',
      status: 'in-progress',
      priority: 'high',
      location: 'Sardar Patel Road, Adyar',
      coordinates: { lat: 12.9923, lng: 80.2356 },
      images: ['/lovable-uploads/5718b24b-f484-406e-bf86-a3b145a51db1.png'],
      reportedBy: { name: 'Rajesh Kumar', id: 'user_1' },
      reportedDate: '2024-08-14T10:30:00Z',
      updatedDate: '2024-08-15T09:20:00Z',
      votes: 36,
      tags: ['streetlights', 'safety', 'electricity'],
      contactInfo: '+91 98765 43210, rajesh.kumar@gmail.com',
      estimatedResolutionTime: '3-5 days',
      distance: '0.2 km'
    },
    {
      id: 'issue_2',
      title: 'Pothole on main road',
      description: 'The main road near IIT Madras entrance is riddled with potholes, making it dangerous and difficult to travel on.',
      category: 'road',
      status: 'reported',
      priority: 'urgent',
      location: 'IIT Madras Main Gate Road',
      coordinates: { lat: 12.9916, lng: 80.2335 },
      images: ['/lovable-uploads/41f9a9b2-5fa1-4417-b310-264b32a91c7a.png'],
      reportedBy: { name: 'Priya Sharma', id: 'user_2' },
      reportedDate: '2024-06-02T10:34:00Z',
      updatedDate: '2024-06-02T10:34:00Z',
      votes: 27,
      tags: ['pothole', 'road', 'safety'],
      contactInfo: '+91 87654 32109, priya.sharma@outlook.com',
      estimatedResolutionTime: '1-2 weeks',
      distance: '0.1 km'
    },
    {
      id: 'issue_3',
      title: 'Garbage not collected',
      description: 'Garbage has been accumulating in the residential area near IIT Madras for over a week without collection.',
      category: 'garbage',
      status: 'reported',
      priority: 'medium',
      location: 'Gandhi Nagar, Adyar',
      coordinates: { lat: 12.9890, lng: 80.2370 },
      images: ['/lovable-uploads/392d5881-0cfa-444e-a735-7260d9d4797d.png'],
      reportedBy: { name: 'Anonymous', id: 'user_3' },
      reportedDate: '2024-06-25T08:15:00Z',
      updatedDate: '2024-06-25T08:15:00Z',
      votes: 11,
      tags: ['garbage', 'collection', 'hygiene'],
      contactInfo: '+91 76543 21098',
      estimatedResolutionTime: '2-3 days',
      distance: '0.4 km'
    },
    {
      id: 'issue_4',
      title: 'Water supply disruption',
      description: 'No water supply in the area for the past 3 days. Residents are facing severe inconvenience.',
      category: 'water',
      status: 'in-progress',
      priority: 'urgent',
      location: 'Velachery Main Road',
      coordinates: { lat: 12.9875, lng: 80.2200 },
      images: [],
      reportedBy: { name: 'Suresh Menon', id: 'user_4' },
      reportedDate: '2024-06-20T06:45:00Z',
      updatedDate: '2024-06-21T14:30:00Z',
      votes: 45,
      tags: ['water', 'supply', 'shortage'],
      contactInfo: '+91 65432 10987, suresh.menon@yahoo.com',
      estimatedResolutionTime: '1-2 days',
      distance: '1.8 km'
    },
    {
      id: 'issue_5',
      title: 'Broken drainage system',
      description: 'Open drainage near residential complex is causing foul smell and health hazards.',
      category: 'infrastructure',
      status: 'reported',
      priority: 'high',
      location: 'Thiruvanmiyur East Coast Road',
      coordinates: { lat: 12.9820, lng: 80.2590 },
      images: [],
      reportedBy: { name: 'Lakshmi Iyer', id: 'user_5' },
      reportedDate: '2024-06-18T11:20:00Z',
      updatedDate: '2024-06-18T11:20:00Z',
      votes: 23,
      tags: ['drainage', 'health', 'infrastructure'],
      contactInfo: '+91 54321 09876, lakshmi.iyer@gmail.com',
      estimatedResolutionTime: '1 week',
      distance: '2.3 km'
    },
    {
      id: 'issue_6',
      title: 'Traffic signal malfunction',
      description: 'Traffic signal at busy intersection not working properly, causing traffic jams.',
      category: 'infrastructure',
      status: 'resolved',
      priority: 'high',
      location: 'Adyar Signal Junction',
      coordinates: { lat: 12.9965, lng: 80.2378 },
      images: [],
      reportedBy: { name: 'Arjun Reddy', id: 'user_6' },
      reportedDate: '2024-06-10T07:30:00Z',
      updatedDate: '2024-06-15T16:45:00Z',
      votes: 38,
      tags: ['traffic', 'signal', 'junction'],
      contactInfo: '+91 43210 98765, arjun.reddy@hotmail.com',
      estimatedResolutionTime: 'Resolved',
      distance: '0.8 km'
    },
    {
      id: 'issue_7',
      title: 'Stray dog menace',
      description: 'Aggressive stray dogs in the area posing threat to children and elderly.',
      category: 'other',
      status: 'reported',
      priority: 'medium',
      location: 'Kotturpuram Housing Board',
      coordinates: { lat: 12.9950, lng: 80.2280 },
      images: [],
      reportedBy: { name: 'Meera Nair', id: 'user_7' },
      reportedDate: '2024-06-22T15:10:00Z',
      updatedDate: '2024-06-22T15:10:00Z',
      votes: 16,
      tags: ['stray', 'animals', 'safety'],
      contactInfo: '+91 32109 87654, meera.nair@rediffmail.com',
      estimatedResolutionTime: '2 weeks',
      distance: '0.9 km'
    },
    {
      id: 'issue_8',
      title: 'Bus stop shelter damaged',
      description: 'Bus stop shelter roof collapsed during recent rains, no protection for commuters.',
      category: 'infrastructure',
      status: 'in-progress',
      priority: 'medium',
      location: 'CEG Bus Stop, Guindy',
      coordinates: { lat: 13.0067, lng: 80.2206 },
      images: [],
      reportedBy: { name: 'Karthik Subramanian', id: 'user_8' },
      reportedDate: '2024-06-16T12:40:00Z',
      updatedDate: '2024-06-20T10:15:00Z',
      votes: 22,
      tags: ['bus-stop', 'shelter', 'public-transport'],
      contactInfo: '+91 21098 76543, karthik.sub@iitm.ac.in',
      estimatedResolutionTime: '1 week',
      distance: '1.5 km'
    },
    {
      id: 'issue_9',
      title: 'Illegal parking blocking road',
      description: 'Vehicles parked illegally on narrow road causing traffic congestion and blocking emergency access.',
      category: 'road',
      status: 'reported',
      priority: 'low',
      location: 'Besant Nagar 2nd Avenue',
      coordinates: { lat: 12.9990, lng: 80.2665 },
      images: [],
      reportedBy: { name: 'Deepak Agarwal', id: 'user_9' },
      reportedDate: '2024-06-24T09:25:00Z',
      updatedDate: '2024-06-24T09:25:00Z',
      votes: 8,
      tags: ['parking', 'traffic', 'congestion'],
      contactInfo: '+91 10987 65432, deepak.agarwal@gmail.com',
      estimatedResolutionTime: '3-5 days',
      distance: '3.1 km'
    },
    {
      id: 'issue_10',
      title: 'Power outage frequent',
      description: 'Frequent power cuts in the residential area affecting daily life and work from home.',
      category: 'electricity',
      status: 'reported',
      priority: 'high',
      location: 'Indira Nagar, Adyar',
      coordinates: { lat: 12.9885, lng: 80.2415 },
      images: [],
      reportedBy: { name: 'Rohit Patel', id: 'user_10' },
      reportedDate: '2024-06-19T14:55:00Z',
      updatedDate: '2024-06-19T14:55:00Z',
      votes: 31,
      tags: ['power', 'outage', 'electricity'],
      contactInfo: '+91 09876 54321, rohit.patel@techcorp.com',
      estimatedResolutionTime: '1 week',
      distance: '0.7 km'
    },
    {
      id: 'issue_11',
      title: 'Mosquito breeding in stagnant water',
      description: 'Stagnant water collected near construction site leading to mosquito breeding and health concerns.',
      category: 'other',
      status: 'reported',
      priority: 'medium',
      location: 'Taramani IT Corridor',
      coordinates: { lat: 12.9550, lng: 80.2350 },
      images: [],
      reportedBy: { name: 'Sunita Joshi', id: 'user_11' },
      reportedDate: '2024-06-21T16:30:00Z',
      updatedDate: '2024-06-21T16:30:00Z',
      votes: 19,
      tags: ['mosquito', 'health', 'stagnant-water'],
      contactInfo: '+91 98765 12340, sunita.joshi@infosys.com',
      estimatedResolutionTime: '1-2 weeks',
      distance: '4.2 km'
    },
    {
      id: 'issue_12',
      title: 'Broken footpath',
      description: 'Footpath tiles are broken and uneven, causing difficulty for pedestrians and wheelchair users.',
      category: 'infrastructure',
      status: 'closed',
      priority: 'medium',
      location: 'Anna University Main Road',
      coordinates: { lat: 13.0118, lng: 80.2335 },
      images: [],
      reportedBy: { name: 'Vinod Kumar', id: 'user_12' },
      reportedDate: '2024-05-28T08:15:00Z',
      updatedDate: '2024-06-10T17:20:00Z',
      votes: 14,
      tags: ['footpath', 'accessibility', 'pedestrian'],
      contactInfo: '+91 87654 09123, vinod.kumar@annauniv.edu',
      estimatedResolutionTime: 'Completed',
      distance: '2.1 km'
    },
    {
      id: 'issue_13',
      title: 'Noise pollution from construction',
      description: 'Construction work starting very early morning causing noise pollution and disturbing residents.',
      category: 'other',
      status: 'in-progress',
      priority: 'low',
      location: 'RA Puram 1st Street',
      coordinates: { lat: 13.0045, lng: 80.2458 },
      images: [],
      reportedBy: { name: 'Kavitha Raman', id: 'user_13' },
      reportedDate: '2024-06-23T05:45:00Z',
      updatedDate: '2024-06-24T11:30:00Z',
      votes: 7,
      tags: ['noise', 'construction', 'pollution'],
      contactInfo: '+91 76543 09812, kavitha.raman@gmail.com',
      estimatedResolutionTime: '2-3 days',
      distance: '1.3 km'
    }
  ];

  // Calculate distances from IITM for all issues
  return issues.map(issue => {
    if (issue.coordinates) {
      const distance = calculateDistance(
        IITM_COORDINATES.lat,
        IITM_COORDINATES.lng,
        issue.coordinates.lat,
        issue.coordinates.lng
      );
      return { ...issue, distance: `${distance} km` };
    }
    return issue;
  });
};

export const getStoredIssues = (): Issue[] => {
  const stored = localStorage.getItem('communityIssues');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate and store demo data if none exists
  const demoIssues = generateDemoIssues();
  localStorage.setItem('communityIssues', JSON.stringify(demoIssues));
  return demoIssues;
};

export const saveIssue = (issue: Issue): void => {
  const issues = getStoredIssues();
  const existingIndex = issues.findIndex(i => i.id === issue.id);
  
  if (existingIndex >= 0) {
    issues[existingIndex] = issue;
  } else {
    issues.unshift(issue);
  }
  
  localStorage.setItem('communityIssues', JSON.stringify(issues));
};

export const searchIssues = (query: string): Issue[] => {
  const issues = getStoredIssues();
  const searchTerm = query.toLowerCase();
  
  return issues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm) ||
    issue.description.toLowerCase().includes(searchTerm) ||
    issue.location.toLowerCase().includes(searchTerm) ||
    issue.category.toLowerCase().includes(searchTerm) ||
    issue.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const sortIssues = (issues: Issue[], sortBy: IssueFilters['sortBy']): Issue[] => {
  switch (sortBy) {
    case 'recent':
      return [...issues].sort((a, b) => 
        new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
      );
    case 'upvoted':
      return [...issues].sort((a, b) => b.votes - a.votes);
    case 'distance':
      return [...issues].sort((a, b) => {
        const distanceA = parseFloat(a.distance?.replace(' km', '') || '999');
        const distanceB = parseFloat(b.distance?.replace(' km', '') || '999');
        return distanceA - distanceB;
      });
    default:
      return issues;
  }
};

export const getIssuesByDistance = (distanceFilter: string): Issue[] => {
  const issues = getStoredIssues();
  
  if (distanceFilter === 'all') return issues;
  
  const maxDistance = parseFloat(distanceFilter.replace('km', ''));
  
  return issues.filter(issue => {
    if (!issue.distance) return false;
    const issueDistance = parseFloat(issue.distance.replace(' km', ''));
    return issueDistance <= maxDistance;
  });
};
