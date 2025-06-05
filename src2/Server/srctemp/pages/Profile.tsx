
import React from "react";
import Header from "../components/Header";
import EnhancedProfile from "../components/EnhancedProfile";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your personal information and preferences</p>
        </div>
        
        <EnhancedProfile />
      </main>
    </div>
  );
};

export default Profile;
