import React, { useState } from "react";
import axios from "axios";

function Postauction() {
  const [formData, setformData] = useState({
    item_name: "",
    description: "",
    starting_price: "",
    start_time: "",
    end_time: "",
    type: "",
    image_url: "",
    category: "",
  });

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/auction/create",
        {
          ...formData,
          is_closed: false,
          current_price: formData.starting_price,
          // Remove user_id if it's extracted in backend from token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Auction created:", res.data);
      // Optional: Reset form
      setformData({
        item_name: "",
        description: "",
        starting_price: "",
        start_time: "",
        end_time: "",
        type: "",
        image_url: "",
        category: "",
      });
    } catch (err) {
      console.error("Error creating auction:", err);
    }
  };

  return (
    <>
      <h2>Create Auction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="item_name"
          placeholder="Item Name"
          value={formData.item_name}
          onChange={handleChange}
          required
        /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="starting_price"
          placeholder="Starting Price"
          value={formData.starting_price}
          onChange={handleChange}
          required
        /><br />

        <input
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        /><br />

        <input
          type="datetime-local"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        /><br />

        <label>Auction Type:</label><br />
        <input
          type="radio"
          id="timed"
          name="type"
          value="timed"
          checked={formData.type === "timed"}
          onChange={handleChange}
        />
        <label htmlFor="timed">Timed</label>

        <input
          type="radio"
          id="live"
          name="type"
          value="live"
          checked={formData.type === "live"}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <label htmlFor="live">Live</label><br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        /><br />

        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
        /><br />

        <button type="submit">Create Auction</button>
      </form>
    </>
  );
}

export default Postauction;
