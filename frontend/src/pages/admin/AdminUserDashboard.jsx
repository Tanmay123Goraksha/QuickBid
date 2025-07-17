import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUserDashboard.css"; // Create for styling

const AdminUserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedAction, setSelectedAction] = useState({});
  const [amount, setAmount] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/search?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleFundAction = async (userId, actionType) => {
    const amt = parseFloat(amount[userId]);
    if (!amt || amt <= 0) return alert("Invalid amount");

    try {
      await axios.post(
        `http://localhost:5000/admin/funds/${actionType}`,
        { userId, amount: amt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${actionType}ed ₹${amt} successfully`);
      fetchUsers(); // Refresh balance
      setSelectedAction((prev) => ({ ...prev, [userId]: null }));
      setAmount((prev) => ({ ...prev, [userId]: "" }));
    } catch (err) {
      alert("Failed to update funds");
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>👨‍💼 Admin User Management</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit">Search</button>
      </form>

      <div className="user-cards">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Balance:</strong> ₹{user.balance}</p>

            <div className="action-buttons">
              <button onClick={() => setSelectedAction({ ...selectedAction, [user.id]: "add" })}>Add Funds</button>
              <button onClick={() => setSelectedAction({ ...selectedAction, [user.id]: "deduct" })}>Deduct Funds</button>
            </div>

            {selectedAction[user.id] && (
              <div className="fund-input">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount[user.id] || ""}
                  onChange={(e) => setAmount({ ...amount, [user.id]: e.target.value })}
                />
                <button onClick={() => handleFundAction(user.id, selectedAction[user.id])}>
                  Confirm {selectedAction[user.id]}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserDashboard;
