import React from "react";
import axios from "axios";
import ProfileSidebar from "./ProfileSidebar";
import { useState } from "react";
import { useEffect } from "react";


const ProfileMain = () => {

const [profile, setProfile] = useState(null);
const token = localStorage.getItem("token");


useEffect(() => {
const fetchProfile = async() => {
    try {
          const res = await axios.get("http://localhost:5000/auction/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setProfile(res.data);
    } catch (error) {
        console.log("Failed to fetch data",error);
    }
};

fetchProfile();

}, [token]);

return (

    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar always visible on the left */}
      <ProfileSidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {profile ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
            <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone || "Not provided"}</p>
              <p><strong>Country:</strong> {profile.country || "Not set"}</p>
              <p><strong>Joined On:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>









);
};
export default ProfileMain;