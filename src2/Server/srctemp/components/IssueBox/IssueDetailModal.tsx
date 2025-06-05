
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Issue } from './types';
import { MapPin, ThumbsUp, Clock, User, Phone, Mail, Calendar, Tag, Bot, Loader2 } from 'lucide-react';
import { T } from '../../hooks/useTranslation';

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (issueId: string) => void;
}

// Add Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

const GEMINI_API_KEY = 'AIzaSyA7fQKCBtHPQUHGX1nZXDOWiJMlO31-uk8';

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ 
  issue, 
  isOpen, 
  onClose, 
  onVote 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);

  useEffect(() => {
    if (isOpen && issue && mapRef.current && !mapInstanceRef.current) {
      // Load Google Maps script if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBfd1bm_3mxeU8VhNwt2GE9-h0BtMT2Sv4&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    }
  }, [isOpen, issue]);

  const initializeMap = () => {
    if (!issue || !mapRef.current || !window.google) return;

    // Geocode the issue location
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: issue.location }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        
        // Create map
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
          center: location,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
        });

        // Add marker
        new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          title: issue.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });

        // Add IITM marker for reference
        const iitmLocation = new window.google.maps.LatLng(12.9916, 80.2336);
        new window.google.maps.Marker({
          position: iitmLocation,
          map: mapInstanceRef.current,
          title: 'IIT Madras',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }
        });
      }
    });
  };

  const handleAiAssistance = async () => {
    if (!issue) return;

    setIsLoadingAi(true);
    setShowAiResponse(true);

    try {
      const prompt = `You are an AI assistant specializing in grievance addressal and issue handling. 

Issue Details:
- Title: ${issue.title}
- Category: ${issue.category}
- Description: ${issue.description}
- Location: ${issue.location}
- Priority: ${issue.priority}
- Status: ${issue.status}

Please provide a comprehensive response that includes:
1. Issue analysis and root cause identification
2. Immediate mitigation steps
3. Long-term resolution strategies
4. Preventive measures
5. Timeline for resolution
6. Relevant authorities to contact

Keep the response practical, actionable, and specific to the issue category and context.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500
          }
        })
      });

      const data = await response.json();
      console.log('Gemini AI Response:', data);

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        setAiResponse(data.candidates[0].content.parts[0].text);
      } else {
        setAiResponse("I'm sorry, I couldn't generate a response at this time. Please try again later.");
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setAiResponse("There was an error processing your request. Please try again later.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Cleanup map when modal closes
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }
  }, [isOpen]);

  if (!issue) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'road': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'electricity': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'garbage': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'water': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'infrastructure': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '📋';
      default: return '📋';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Reported';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'road': return 'Road';
      case 'electricity': return 'Electricity';
      case 'garbage': return 'Garbage';
      case 'water': return 'Water';
      case 'infrastructure': return 'Infrastructure';
      default: return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 mb-3">
              <Badge className={getCategoryColor(issue.category)}>
                <T>{getCategoryText(issue.category)}</T>
              </Badge>
              <Badge className={getStatusColor(issue.status)}>
                <T>{getStatusText(issue.status)}</T>
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400">
              <T>Report Spam</T>
            </Button>
          </div>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {getPriorityIcon(issue.priority)}
            <T>{issue.title}</T>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Image */}
            {issue.images && issue.images.length > 0 && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img 
                  src={issue.images[0]} 
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3"><T>Description</T></h3>
              <p className="text-gray-300 leading-relaxed">
                <T>{issue.description}</T>
              </p>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-3"><T>Activity</T></h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(issue.reportedDate).toLocaleDateString()} - <T>Reported by user</T></span>
                </div>
                {issue.status === 'in-progress' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(issue.updatedDate).toLocaleDateString()} - <T>Assigned to municipal worker</T></span>
                  </div>
                )}
                {issue.status === 'in-progress' && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(issue.updatedDate).toLocaleDateString()} - <T>Marked "In Progress"</T></span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistance Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <T>AI Assistance</T>
                </h3>
                <Button
                  onClick={handleAiAssistance}
                  disabled={isLoadingAi}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                >
                  {isLoadingAi ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <T>Analyzing...</T>
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      <T>Grievance Addressal & Issue Handling Assistance through AI</T>
                    </>
                  )}
                </Button>
              </div>

              {showAiResponse && (
                <div className="bg-gray-800 rounded-lg p-4">
                  {isLoadingAi ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      <span className="ml-2 text-gray-300"><T>AI is analyzing the issue...</T></span>
                    </div>
                  ) : (
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      <T>{aiResponse}</T>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status and Votes */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-right mb-2">
                <div className="text-yellow-400 text-sm">● <T>{getStatusText(issue.status)}</T></div>
              </div>
              <div className="text-right text-sm text-gray-400 mb-4">
                <T>Reported by</T>: <T>{issue.reportedBy.name}</T>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote?.(issue.id)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="h-4 w-4" />
                {issue.votes}
              </Button>
            </div>

            {/* Location with Google Maps */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-pink-400">📍 <T>Location</T></h4>
              <p className="text-sm text-gray-300 mb-3"><T>{issue.location}</T></p>
              
              {/* Google Maps view */}
              <div 
                ref={mapRef}
                className="w-full h-32 bg-gray-700 rounded-lg"
                style={{ minHeight: '128px' }}
              >
                {!window.google && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <T>Loading map...</T>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {issue.distance} <T>from IITM</T>
              </div>
            </div>

            {/* Contact Info */}
            {issue.contactInfo && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <Mail className="h-4 w-4" />
                  <T>Contact</T>
                </h4>
                <p className="text-sm text-gray-300">{issue.contactInfo}</p>
              </div>
            )}

            {/* Tags */}
            {issue.tags && issue.tags.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <T>Tags</T>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {issue.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #<T>{tag}</T>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Resolution */}
            {issue.estimatedResolutionTime && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <T>Resolution Time</T>
                </h4>
                <p className="text-sm text-gray-300"><T>{issue.estimatedResolutionTime}</T></p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailModal;
