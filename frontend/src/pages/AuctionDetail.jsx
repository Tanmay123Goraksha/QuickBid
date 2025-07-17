import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import "./AuctionDetail.css"; // We'll add styles here

const socket = io("http://localhost:5000");

function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [joined, setJoined] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidFeed, setBidFeed] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(res.data.userId);
      } catch (err) {
        console.log("Auth check failed:", err);
      }
    };
    if (token) getUser();
  }, [token]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auction/${id}`);
        setAuction(res.data);
        setCurrentBid(res.data.current_price);
      } catch (error) {
        console.log("Error fetching auction", error);
      }
    };

    fetchAuction();

    socket.on("newBid", (data) => {
      if (data.auctionId === parseInt(id)) {
        setCurrentBid(data.bid.bid_amount);
        setBidFeed((prevFeed) => [
          ...prevFeed,
          `${data.bid.username} bid ₹${data.bid.bid_amount}`,
        ]);
      }
    });

    return () => {
      socket.off("newBid");
    };
  }, [id]);

  const handleJoinAuction = () => {
    socket.emit("joinAuctionRoom", id);
    setJoined(true);
  };

  const handleBidSubmit = () => {
    const numericBid = parseFloat(bidAmount);
    if (!numericBid || numericBid <= currentBid) {
      return setErrorMsg("Bid must be higher than current price.");
    }

    socket.emit("placeBid", {
      auctionId: parseInt(id),
      userId,
      bidAmount: numericBid,
    });

    setBidAmount("");
    setErrorMsg("");
  };

  const isLive = () => {
    if (!auction) return false;
    const now = new Date();
    return new Date(auction.start_time) <= now && now <= new Date(auction.end_time);
  };

  return (
    <div className="auction-container">
      {auction ? (
        <>
          <div className="auction-sidebar">
            <h2>{auction.item_name}</h2>
            <img src={auction.image_url} alt="item" width="100%" />
            <p><strong>Posted by:</strong> User {auction.username}</p>
            <p><strong>Category:</strong> {auction.category}</p>
            <p><strong>Start Price:</strong> ₹{auction.starting_price}</p>
            <p><strong>Current Bid:</strong> ₹{currentBid}</p>
            <p><strong>Start:</strong> {new Date(auction.start_time).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(auction.end_time).toLocaleString()}</p>
            {auction.is_closed && auction.winner_name && (
            <p className="text-green-700 font-semibold">
              🏆 Winner: {auction.winner_name}
            </p>
)}
{auction.is_closed && !auction.winner_name && (
  <p className="text-red-500">No winner – No bids placed</p>
)}

          </div>

          <div className="auction-chat">
{auction.type === "live" && isLive() ? (
  <>
    {!joined ? (
<button
  className="join-btn"
  onClick={handleJoinAuction}
  disabled={userId === auction.user_id}
  style={{
    backgroundColor: userId === auction.user_id ? "#ccc" : "#28a745",
    cursor: userId === auction.user_id ? "not-allowed" : "pointer",
  }}
  title={userId === auction.user_id ? "You cannot join your own auction" : "Join the live auction"}
>
  Join Live Auction
</button>

    ) : (
      <>
        <div className="chat-feed">
          {bidFeed.length === 0 ? (
            <p>No bids yet</p>
          ) : (
            bidFeed.map((msg, index) => (
              <p key={index} className="chat-msg">{msg}</p>
            ))
          )}
        </div>
        <div className="chat-input">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid"
          />
          <button onClick={handleBidSubmit}>Submit</button>
        </div>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </>
    )}
  </>
) : (
  <p>{auction.type === "live" ? "⏳ Not live yet" : "📦 Timed auction"}</p>
)}

          </div>
        </>
      ) : (
        <p>Loading auction...</p>
      )}
    </div>
  );
}

export default AuctionDetail;
