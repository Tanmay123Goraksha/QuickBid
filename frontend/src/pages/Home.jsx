import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./Home.css";
import io from "socket.io-client";

// Create socket instance
const socket = io("http://localhost:5000");

// Utility to decode JWT token and get user ID
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);

    if (decoded?.id) {
      socket.emit("joinUserRoom", decoded.id); // Join personal room

      socket.on("wonAuction", (data) => {
        alert(data.message); // 🔔 Notification for winner
      });
    }

    return () => {
      socket.off("wonAuction");
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <p className="description">
          QuickBid is an intuitive online auction platform where users can bid on unique items in two exciting ways — through live auctions or timed bidding that closes at a set deadline. Sellers can effortlessly list their items with full details, while buyers enjoy a seamless, real-time bidding experience. Whether you're here to sell or to win your next great find, QuickBid makes auctions simple, fast, and engaging.
        </p>

        <div className="card-container">
          <div className="card" onClick={() => navigate("/auctions")}>
            <h3>Browse Auctions</h3>
            <p>Explore live and timed auctions</p>
          </div>

          <div className="card" onClick={() => navigate("/post")}>
            <h3>Post an Auction</h3>
            <p>List your items for bidding</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
