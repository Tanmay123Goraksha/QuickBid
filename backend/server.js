const express = require('express');
const cors = require('cors');
const client = require("./db/db");
const authenticateToken = require("./middleware/authMiddleware");
const auctionRoutes = require("./routes/auction");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"]
    }
});

app.locals.io = io;


app.use(cors());
app.use(express.json());




app.get("/",(req,res) => {
    res.send("Auction Server Running");
});


const authRoutes = require("./routes/auth");

app.use("/auth",authRoutes);


app.get("/dbtest",async(req,res) => {
    try {
        const result = await client.query("Select Now()");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
    }
})


app.get("/protected", authenticateToken, (req,res) => {
    res.json({message: `Hello, ${req.user.email}`, userId: req.user.id});
})


app.use('/auction',auctionRoutes);


io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("joinAuctionRoom", (auctionId) => {
    socket.join(`auction_${auctionId}`);
    console.log(`User joined room auction_${auctionId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("placeBid", async ({ auctionId, userId, bidAmount }) => {
    try {
      // Fetch the auction
      const res = await client.query(
        "SELECT * FROM auctions WHERE id = $1",
        [auctionId]
      );

      const auction = res.rows[0];
      if (!auction || auction.is_closed) return;

      const now = new Date();
      if (now < auction.start_time || now > auction.end_time) return;

      if(auction.is_closed){
        console.log("Bid rejected, Auction is closed");
        return;
      }

          if (auction.user_id === userId) {
      console.log("Bid rejected: owner cannot bid on their own auction");
      return;
    }


      // Check highest current bid
      const bidRes = await client.query(
        "SELECT MAX(bid_amount) AS highest FROM bids WHERE auction_id = $1",
        [auctionId]
      );

      const highestBid = bidRes.rows[0].highest || auction.starting_price;

      if (bidAmount <= highestBid) return;

      // Insert new bid
      const insertRes = await client.query(
        "INSERT INTO bids (auction_id, user_id, bid_amount) VALUES ($1, $2, $3) RETURNING *",
        [auctionId, userId, bidAmount]
      );

      // Update auction price
      await client.query(
        "UPDATE auctions SET current_price = $1 WHERE id = $2",
        [bidAmount, auctionId]
      );

      //Fetch user name from users table
      const userRes = await client.query(
        "SELECT name FROM users WHERE id = $1",
        [userId]
      );

      const username = userRes.rows[0]?.name || `User ${userId}`;

      // Emit bid with username
      io.to(`auction_${auctionId}`).emit("newBid", {
        auctionId,
        bid: {
          ...insertRes.rows[0],
          username, 
        },
      });

    } catch (error) {
      console.error(error);
    }
  });
})



const Port = 5000;

server.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
});