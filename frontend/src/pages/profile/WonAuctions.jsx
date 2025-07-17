import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileSidebar from "./ProfileSidebar";
import { useNavigate } from "react-router-dom";

const WonAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWonAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auction/profile/won-auctions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuctions(res.data);
      } catch (err) {
        console.error("Failed to fetch won auctions", err);
      }
    };

    fetchWonAuctions();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">🏆 Won Auctions</h2>
        {auctions.length === 0 ? (
          <p>You have not won any auctions yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">{auction.item_name}</h3>
                <p className="text-sm text-gray-600">{auction.description}</p>
                <p className="text-sm">Final Price: ₹{auction.current_price}</p>
                <p className="text-sm">Ended on: {new Date(auction.end_time).toLocaleString()}</p>
                <button
                  onClick={() => navigate(`/auction/${auction.id}`)}
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

export default WonAuctions;
