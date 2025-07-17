import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileSidebar from "./ProfileSidebar";



const BiddingHistory = () => {

const [history, setHistory] = useState([])
const token = localStorage.getItem("token");

useEffect(() => {
    const fetchHistory = async() => {
        try {
                const res = await axios.get("http://localhost:5000/auction/profile/bidding-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(res.data);
        } catch (error) {
                    console.error("Failed to fetch bidding history", error);
        }
    }
    fetchHistory();
},[token]);



  return (
    <div className="flex min-h-screen bg-gray-100">
      <ProfileSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">📜 Bidding History</h2>
        {history.length === 0 ? (
          <p>You haven’t placed any bids yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{entry.item_name}</h3>
                <p>{entry.description}</p>
                <p className="text-sm">Your Bid: ₹{entry.bid_amount}</p>
                <p className="text-sm">Placed On: {new Date(entry.created_at).toLocaleString()}</p>
                <p className="text-sm">
                  Status: {entry.is_closed ? "Ended" : "Active"} | Ends:{" "}
                  {new Date(entry.end_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );


};

export default BiddingHistory;