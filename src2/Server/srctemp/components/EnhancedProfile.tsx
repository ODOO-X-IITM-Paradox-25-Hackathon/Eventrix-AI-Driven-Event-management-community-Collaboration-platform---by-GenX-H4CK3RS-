import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Github, Linkedin, Twitter, Calendar, Heart, Eye, Users, Upload, Sparkles, BarChart3 } from "lucide-react";
import EventAnalyticsDashboard from "./EventAnalyticsDashboard";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  location: string;
  address: string;
  bio: string;
  company: string;
  position: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  profilePicture: string;
  interests: string[];
  emergencyContact: string;
  emergencyPhone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  languages: string[];
  eventsAttended: number;
  eventsCreated: number;
  totalLikes: number;
  profileViews: number;
}

const EnhancedProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    alternatePhone: "+91 8765432109",
    location: "Chennai, Tamil Nadu",
    address: "123 Tech Street, Adyar, Chennai - 600020",
    bio: "Passionate about technology and innovation. Love attending tech meetups and conferences.",
    company: "Tech Solutions Inc.",
    position: "Software Engineer",
    website: "https://johndoe.dev",
    github: "johndoe",
    linkedin: "john-doe-dev",
    twitter: "johndoe_dev",
    instagram: "johndoe_tech",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    interests: ["Technology", "Music", "Photography", "Travel"],
    emergencyContact: "Jane Doe",
    emergencyPhone: "+91 9876543211",
    dateOfBirth: "1995-06-15",
    gender: "Male",
    nationality: "Indian",
    languages: ["English", "Tamil", "Hindi"],
    eventsAttended: 42,
    eventsCreated: 8,
    totalLikes: 156,
    profileViews: 1240
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [avatarDescription, setAvatarDescription] = useState("");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
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

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const generateAIAvatar = async () => {
    if (!avatarDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for your AI avatar.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAvatar(true);
    try {
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarDescription)}&backgroundColor=b6e3f4&clothesColor=262e33`;
      
      setProfileData(prev => ({
        ...prev,
        profilePicture: avatarUrl
      }));

      toast({
        title: "Avatar Generated!",
        description: "Your AI avatar has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate AI avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData(prev => ({
          ...prev,
          profilePicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
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
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
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
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileData.profilePicture} />
                    <AvatarFallback className="text-lg">{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </label>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="Describe your ideal avatar..."
                          value={avatarDescription}
                          onChange={(e) => setAvatarDescription(e.target.value)}
                          className="text-sm"
                        />
                        <Button 
                          onClick={generateAIAvatar}
                          disabled={isGeneratingAvatar}
                          size="sm"
                          className="w-full"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isGeneratingAvatar ? "Generating..." : "Generate AI Avatar"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold">{profileData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{profileData.position} at {profileData.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{profileData.bio}</p>
                  
                  {/* Enhanced Profile Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-bold text-xl">{profileData.eventsAttended}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Events Attended</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-5 w-5 text-green-500" />
                        <span className="font-bold text-xl">{profileData.eventsCreated}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Events Created</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="font-bold text-xl">{getLikedEvents()}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Liked Events</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <span className="font-bold text-xl">{profileData.profileViews}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Profile Views</p>
                    </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Contact Fields */}
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
                    Primary Phone
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
                    <Phone className="h-4 w-4" />
                    Alternate Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.alternatePhone}
                      onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.alternatePhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.gender}</p>
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

                <div className="space-y-2 md:col-span-2">
                  <Label>Full Address</Label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nationality</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.nationality}</p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-red-600 dark:text-red-400">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Emergency Contact Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.emergencyContact}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Emergency Phone</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 rounded dark:bg-gray-800">{profileData.emergencyPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="relative group">
                      {language}
                      {isEditing && (
                        <button
                          onClick={() => removeLanguage(language)}
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
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language"
                      onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    />
                    <Button onClick={addLanguage} variant="outline">Add</Button>
                  </div>
                )}
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

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Instagram
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profileData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="username"
                    />
                  ) : (
                    <a href={`https://instagram.com/${profileData.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded dark:bg-gray-800 text-blue-500 hover:underline block">
                      @{profileData.instagram}
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
        </TabsContent>

        <TabsContent value="analytics">
          <EventAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProfile;
