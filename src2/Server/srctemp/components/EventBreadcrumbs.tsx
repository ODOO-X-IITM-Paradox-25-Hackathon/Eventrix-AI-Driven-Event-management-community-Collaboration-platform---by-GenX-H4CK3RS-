
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Calendar, User, Settings } from 'lucide-react';

interface EventBreadcrumbsProps {
  eventName?: string;
  eventCategory?: string;
  navigationContext?: 'all' | 'tech' | 'cultural' | 'music' | 'outdoor' | 'wellness' | 'education';
}

const EventBreadcrumbs: React.FC<EventBreadcrumbsProps> = ({ 
  eventName, 
  eventCategory, 
  navigationContext 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: { [key: string]: { label: string; icon?: React.ReactNode } } = {
    '': { label: 'Home', icon: <Home className="h-4 w-4" /> },
    'events': { label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    'profile': { label: 'Profile', icon: <User className="h-4 w-4" /> },
    'my-events': { label: 'My Events', icon: <Calendar className="h-4 w-4" /> },
    'registered-events': { label: 'Registered Events', icon: <Calendar className="h-4 w-4" /> },
    'liked-events': { label: 'Liked Events', icon: <Calendar className="h-4 w-4" /> },
    'create-event': { label: 'Create Event', icon: <Calendar className="h-4 w-4" /> },
    'engage': { label: 'Event Engagement', icon: <Calendar className="h-4 w-4" /> },
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'tech': 'Tech Conference',
      'cultural': 'Cultural Festival',
      'music': 'Music Festival',
      'outdoor': 'Outdoor Event',
      'wellness': 'Wellness Event',
      'education': 'Educational Event',
    };
    return categoryMap[category] || category;
  };

  // Get navigation context from localStorage or URL params
  const getNavigationContext = () => {
    if (navigationContext) return navigationContext;
    
    // Check if we came from a specific category filter
    const storedContext = localStorage.getItem('lastCategoryFilter');
    if (storedContext && storedContext !== 'all') {
      return storedContext;
    }
    
    return 'all';
  };

  const currentContext = getNavigationContext();

  const renderCustomBreadcrumb = () => {
    // For event detail pages, show custom breadcrumb based on navigation context
    if (pathnames.includes('events') && eventName && eventCategory) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 cursor-pointer hover:text-eventrix transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            <BreadcrumbSeparator />
            
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 cursor-pointer hover:text-eventrix transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Events
              </BreadcrumbLink>
            </BreadcrumbItem>

            {currentContext !== 'all' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => {
                      navigate('/');
                      // Set the category filter when going back
                      setTimeout(() => {
                        const event = new CustomEvent('categoryChange', { detail: currentContext });
                        window.dispatchEvent(event);
                      }, 100);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:text-eventrix transition-colors capitalize"
                  >
                    {currentContext}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            <BreadcrumbSeparator />
            
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {getCategoryLabel(eventCategory)} - {eventName}
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

    // Default breadcrumb for other pages
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer hover:text-eventrix transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((pathname, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const breadcrumbInfo = breadcrumbMap[pathname];

            return (
              <React.Fragment key={pathname}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2">
                      {breadcrumbInfo?.icon}
                      {breadcrumbInfo?.label || pathname}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      onClick={() => navigate(to)}
                      className="flex items-center gap-2 cursor-pointer hover:text-eventrix transition-colors"
                    >
                      {breadcrumbInfo?.icon}
                      {breadcrumbInfo?.label || pathname}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
      {renderCustomBreadcrumb()}
    </div>
  );
};

export default EventBreadcrumbs;
