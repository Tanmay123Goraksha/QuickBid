import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const MyAuctions = () => {

const [auctions, setAuctions] = useState([]);
const navigate = useNavigate();
const token = localStorage.getItem("token");


useEffect(() => {
    const fetchMyAuctions = async () => {
        try {
           const response = await axios.get("http://localhost:5000/auction/my-auctions", {
            headers:{
                Authorization: `Bearer ${token}`,
            }
           }) 
           setAuctions(response.data);
        } catch (error) {
            console.log("Cant Fetch Auctions",error);
        }
    }

    fetchMyAuctions();
},[token]);

return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">My Posted Auctions</h2>
      {auctions.length === 0 ? (
        <p>You haven't posted any auctions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-xl font-semibold">{auction.item_name}</h3>
              <p className="text-gray-700">{auction.description}</p>
              <p>🕒 Ends at: {new Date(auction.end_time).toLocaleString()}</p>
              <p>💰 Current Price: ₹{auction.current_price}</p>
              <div className="mt-3 flex space-x-2">
              <button
                onClick={() => navigate(`/auction/owner/${auction.id}`)}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Owner View
              </button>
                <button
                  onClick={() => navigate(`/edit-auction/${auction.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}

export default MyAuctions;
