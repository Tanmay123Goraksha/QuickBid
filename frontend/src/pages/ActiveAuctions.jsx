import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ActiveAuctions(){
const [auctions, setAuctions] = useState([]);
const [userId, setUserId] = useState(null);
const navigate = useNavigate();
const token = localStorage.getItem("token");

useEffect(() => {
  const fetchUserId = async () => {
    try {
        const res = await axios.get("http://localhost:5000/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(res.data.userId);
    } catch (error) {
      console.log(error);
    }
  }

  if (token) fetchUserId();

}, [token]);






useEffect(() => {
    const fetchAuctions = async () => {
        try {
           const res = await axios.get("http://localhost:5000/auction/active");
           setAuctions(res.data);
        } catch (error) {
            console.log("Error fetching auctions",err);
        }
    }
    fetchAuctions();
}, []);

  const handleViewAuction = (auction) => {
    if (userId === auction.user_id) {
      navigate(`/auctionownerdashboard/${auction.id}`);
    } else {
      navigate(`/auction/${auction.id}`);
    }
  };


 return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.length === 0 ? (
        <p>No active auctions.</p>
      ) : (
        <ul>
          {auctions.map((auction) => (
            <li key={auction.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
              <h3>{auction.item_name}</h3>
              <p>{auction.description}</p>
              <p><strong>Type:</strong> {auction.type}</p>
              <p><strong>Category:</strong> {auction.category}</p>
              <p><strong>Starting Price:</strong> ₹{auction.starting_price}</p>
              <p><strong>Current Price:</strong> ₹{auction.current_price}</p>
              <p><strong>Starts:</strong> {new Date(auction.start_time).toLocaleString()}</p>
              <p><strong>Ends:</strong> {new Date(auction.end_time).toLocaleString()}</p>
              {auction.image_url && <img src={auction.image_url} alt="item" width="200" />}
              <button onClick={() => handleViewAuction(auction)}>View Auction</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActiveAuctions;