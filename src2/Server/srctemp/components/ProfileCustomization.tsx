
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Github, Linkedin, Twitter, Calendar, Heart, Eye, Users, Crown } from "lucide-react";
import VIPStatusBadge from "./VIPStatusBadge";
import { calculateVIPStatus, getVIPBenefits, VIPMetrics } from "../utils/vipCalculator";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  company: string;
  position: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  profilePicture: string;
  interests: string[];
  eventsAttended: number;
  eventsCreated: number;
  totalLikes: number;
  profileViews: number;
  speakerEvents: number;
  maxAudiencePulled: number;
  totalRewards: number;
  loyaltyScore: number;
  subscriptionTier: 'premium' | 'basic' | 'free';
}

const ProfileCustomization: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    location: "Chennai, Tamil Nadu",
    bio: "Passionate about technology and innovation. Love attending tech meetups and conferences.",
    company: "Tech Solutions Inc.",
    position: "Software Engineer",
    website: "https://johndoe.dev",
    github: "johndoe",
    linkedin: "john-doe-dev",
    twitter: "johndoe_dev",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    interests: ["Technology", "Music", "Photography", "Travel"],
    eventsAttended: 42,
    eventsCreated: 8,
    totalLikes: 156,
    profileViews: 1240,
    speakerEvents: 5,
    maxAudiencePulled: 250,
    totalRewards: 12,
    loyaltyScore: 85,
    subscriptionTier: 'basic'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const { toast } = useToast();

  const vipMetrics: VIPMetrics = {
    eventsAttended: profileData.eventsAttended,
    eventsCreated: profileData.eventsCreated,
    totalRewards: profileData.totalRewards,
    speakerEvents: profileData.speakerEvents,
    maxAudiencePulled: profileData.maxAudiencePulled,
    loyaltyScore: profileData.loyaltyScore,
    subscriptionTier: profileData.subscriptionTier
  };

  const vipTier = calculateVIPStatus(vipMetrics);
  const vipBenefits = getVIPBenefits(vipTier);

  const handleInputChange = (field: keyof ProfileData, value: string | string[] | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const getLikedEvents = () => {
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    return likedEvents.length;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.profilePicture} />
              <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <VIPStatusBadge tier={vipTier} />
              </div>
              <p className="text-gray-600 dark:text-gray-300">{profileData.position} at {profileData.company}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{profileData.bio}</p>
              
              {/* Profile Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-bold">{profileData.eventsAttended}</span>
                  </div>
                  <p className="text-xs text-gray-600">Events Attended</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="font-bold">{profileData.eventsCreated}</span>
                  </div>
                  <p className="text-xs text-gray-600">Events Created</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-bold">{getLikedEvents()}</span>
                  </div>
                  <p className="text-xs text-gray-600">Liked Events</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span className="font-bold">{profileData.speakerEvents}</span>
                  </div>
                  <p className="text-xs text-gray-600">Speaker Events</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Status Benefits Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            VIP Status Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Status:</span>
              <VIPStatusBadge tier={vipTier} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Your Benefits:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <div className="space-y-2">
              <Label>Profile Picture URL</Label>
              <Input
                value={profileData.profilePicture}
                onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Company
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.company}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Position
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.position}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              ) : (
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded dark:bg-gray-800 text-blue-500 hover:underline block">
                  {profileData.website}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="username"
                />
              ) : (
                <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded dark:bg-gray-800 text-blue-500 hover:underline block">
                  @{profileData.github}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="username"
                />
              ) : (
                <a href={`https://linkedin.com/in/${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded dark:bg-gray-800 text-blue-500 hover:underline block">
                  {profileData.linkedin}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              {isEditing ? (
                <Input
                  value={profileData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="username"
                />
              ) : (
                <a href={`https://twitter.com/${profileData.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded dark:bg-gray-800 text-blue-500 hover:underline block">
                  @{profileData.twitter}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio and Interests Card */}
      <Card>
        <CardHeader>
          <CardTitle>About & Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Bio</Label>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.bio}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="relative group">
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button onClick={addInterest} variant="outline">Add</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-eventrix hover:bg-eventrix-hover">
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-eventrix hover:bg-eventrix-hover">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCustomization;
