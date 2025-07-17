import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";



const ParticipatedAuctions = () => {

const [auctions,setAuctions] = useState([]);
const token = localStorage.getItem("token");
const navigate = useNavigate();


useEffect(() => {

const fetchParticipated = async() => {

    try {
          const res = await axios.get("http://localhost:5000/auction/participated-auctions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuctions(res.data);  
    } catch (error) {
        console.log("Failed to fetch participated auctions",error);
    }

};
fetchParticipated();

},[token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">📌 Participated Auctions</h2>
        {auctions.length === 0 ? (
          <p>You have not participated in any auctions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{auction.item_name}</h3>
                <p className="text-sm text-gray-600">{auction.description}</p>
                <p className="text-sm">Type: {auction.type}</p>
                <p className="text-sm">Status: {auction.is_closed ? "Ended" : "Active"}</p>
                <p className="text-sm">Current Price: ₹{auction.current_price}</p>
                <p className="text-sm">Ends on: {new Date(auction.end_time).toLocaleString()}</p>
                <button
                  onClick={() => {
                    if (auction.id && !isNaN(auction.id)) {
                      navigate(`/auction/${auction.id}`);
                    } else {
                      console.error("Invalid auction ID:", auction.id);
                    }
                  }}

                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Auction
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipatedAuctions;



