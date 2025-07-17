import React from "react";
import axios from "axios";
import ProfileSidebar from "./ProfileSidebar";
import { useState } from "react";
import { useEffect } from "react";



const EditProfile = () => {

const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
});



const token = localStorage.getItem("token");

useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = axios.get("http://localhost:5000/profile",{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone || "",
                country: res.data.country || "",
            });
        } catch (error) {
            console.error("Failed to fetch profile",error);
        }
    };
    if (token) fetchUser();
},[token]);

const handleChange = (e) => {
    setFormData({...formData,[e.target.name]: e.target.value});
};


const handleUpdate = async (e) => {

    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }

}

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );




}



export default EditProfile;