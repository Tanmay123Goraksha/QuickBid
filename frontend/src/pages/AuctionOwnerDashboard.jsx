import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AuctionDetail.css";

const socket = io("http://localhost:5000");

function AuctionOwnerDashboard() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidFeed, setBidFeed] = useState([]);
  const [token] = useState(localStorage.getItem("token"));

const navigate = useNavigate();


  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/auction/${id}`);
        setAuction(res.data);
      } catch (error) {
        console.error("Error fetching auction details", error);
      }
    };

    fetchAuction();

    socket.emit("joinAuctionRoom", id);

    socket.on("newBid", (data) => {
      if (data.auctionId === parseInt(id)) {
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

  return (
    <div className="auction-container">
      {auction ? (
        <>
          <div className="auction-sidebar">
            <h2>{auction.item_name}</h2>
            <img src={auction.image_url} alt="item" width="100%" />
            <p><strong>Posted by:</strong> You</p>
            <p><strong>Category:</strong> {auction.category}</p>
            <p><strong>Start Price:</strong> ₹{auction.starting_price}</p>
            <p><strong>Current Price:</strong> ₹{auction.current_price}</p>
            <p><strong>Start:</strong> {new Date(auction.start_time).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(auction.end_time).toLocaleString()}</p>
            <button
             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
             onClick={async () => {
              try {
                const res = await axios.patch(
                         `http://localhost:5000/auction/${id}/end`,
                         {},
                {
                  headers:{
                    Authorization:`Bearer ${token}`,
                  }
                })
                alert("Auction Ended Successfully");
                navigate("/");
              } catch (error) {
                alert("Error Ending Auction");
                console.error(error);
              }
             }}>

            End Auction
            </button>
          </div>

          <div className="auction-chat">
            <h3>Live Bids</h3>
            <div className="chat-feed">
              {bidFeed.length === 0 ? (
                <p>No bids yet</p>
              ) : (
                bidFeed.map((msg, index) => (
                  <p key={index} className="chat-msg">{msg}</p>
                ))
              )}
            </div>
            <p style={{ color: "gray", marginTop: "1rem" }}>
              * You are the auction owner. Bidding is disabled.
            </p>
          </div>
        </>
      ) : (
        <p>Loading auction details...</p>
      )}
    </div>
  );
}

export default AuctionOwnerDashboard;
