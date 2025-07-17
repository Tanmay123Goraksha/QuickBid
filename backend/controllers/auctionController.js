const client = require("../db/db");


const createAuction = async (req, res) => {
  const userId = req.user.id;
  const {
    item_name,
    description,
    starting_price,
    start_time,
    end_time,
    type,
    is_closed,
    current_price,
    image_url,
    category,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO auctions 
        (user_id, item_name, description, starting_price, start_time, end_time, type, is_closed, current_price, image_url, category)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        userId,
        item_name,
        description,
        starting_price,
        start_time,
        end_time,
        type,
        is_closed,
        current_price,
        image_url,
        category,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to create auction" });
  }
};



const getActiveAuctions = async (req, res) => {
  const now = new Date();
  try {
    const result = await client.query(
      `SELECT * FROM auctions 
       WHERE is_closed = false AND end_time > $1
       ORDER BY start_time ASC`,
      [now]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const placeBid = async (req, res) => {
  const userId = req.user.id;
  const auctionId = req.params.id;
  const { bid_amount } = req.body;

  try {
    const auctionRes = await client.query(`SELECT * FROM auctions WHERE id = $1 AND is_closed = false`, [auctionId]);
    const auction = auctionRes.rows[0];

    if (!auction || auction.is_closed) {
      return res.status(400).json({ message: "Auction not available" });
    }

    if (auction.user_id === userId) {
      return res.status(403).json({ message: "You cannot bid on your own auction" });
    }

    const now = new Date();
    if (now < auction.start_time || now > auction.end_time) {
      return res.status(400).json({ message: "Auction not currently accepting bids" });
    }

    const bidRes = await client.query(`SELECT MAX(bid_amount) AS highest_bid FROM bids WHERE auction_id = $1`, [auctionId]);
    const highestBid = bidRes.rows[0].highest_bid || auction.starting_price;

    if (bid_amount <= highestBid) {
      return res.status(400).json({ message: `Bid must be higher than ₹${highestBid}` });
    }

    const walletRes = await client.query(`SELECT balance FROM accounts WHERE user_id = $1`, [userId]);
    const totalBalance = walletRes.rows[0].balance;

    const lockedRes = await client.query(`SELECT COALESCE(SUM(amount), 0) AS locked FROM locked_funds WHERE user_id = $1`, [userId]);
    const lockedTotal = lockedRes.rows[0].locked;

    const availableBalance = totalBalance - lockedTotal;

    if (bid_amount > availableBalance) {
      return res.status(400).json({ message: `Insufficient balance. Available: ₹${availableBalance}` });
    }

    await client.query(`
      INSERT INTO locked_funds (user_id, auction_id, amount)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, auction_id)
      DO UPDATE SET amount = EXCLUDED.amount
    `, [userId, auctionId, bid_amount]);

    const result = await client.query(
      `INSERT INTO bids (auction_id, user_id, bid_amount) VALUES ($1, $2, $3) RETURNING *`,
      [auctionId, userId, bid_amount]
    );

    const io = req.app.locals.io;
    io.to(`auction_${auctionId}`).emit("newBid", {
      auctionId,
      bid: {
        id: result.rows[0].id,
        userId,
        bid_amount,
        created_at: result.rows[0].created_at,
      }
    });

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};



const searchAuctions = async (req,res) => {

  const {query = "", category = ""} = req.query;

  try {
    const result = await client.query(
      `Select * From auctions
      Where is_closed = false
      AND end_time > NOW()
      AND item_name ILIKE $1
      AND ($2 = '' OR category = $2)
      ORDER BY start_time ASC`,
      [`%${query}%`, category]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({message:"Server error"});
  }

};


const getAuctionById = async (req, res) => {

const auctionId = parseInt(req.params.id, 10);

if (isNaN(auctionId)) {
  return res.status(400).json({ message: "Invalid auction ID" });
}




  try {
    const result = await client.query(
      `SELECT a.*, 
              u.name AS posted_by,
              w.name AS winner_name
       FROM auctions a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN users w ON a.winner_id = w.id
       WHERE a.id = $1`, 
      [auctionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching auction by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



const getUserAuctions = async (req,res) => {
const userId = req.user.id;
try {
  const result = await client.query(
    "SELECT * FROM auctions WHERE user_id = $1",
    [userId]
  );
res.json(result.rows);

} catch (error) {
      res.status(500).json({ message: "Server error" });
}


}


const endAuction = async (req, res) => {
  const auctionId = req.params.id;
  const userId = req.user.id;

  try {
    // Ensure the auction exists and is owned by this user
    const result = await client.query(
      "SELECT * FROM auctions WHERE id = $1 AND user_id = $2",
      [auctionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Not authorized or auction not found" });
    }

    // Get the highest bidder for this auction
    const highestBidRes = await client.query(
      `SELECT user_id FROM bids 
       WHERE auction_id = $1 
       ORDER BY bid_amount DESC 
       LIMIT 1`,
      [auctionId]
    );

    const winnerId = highestBidRes.rows.length > 0 ? highestBidRes.rows[0].user_id : null;

    // Close auction and store winner
   await client.query("BEGIN");

  if(winnerId){
  const highestBidAmountRes = await client.query(
    `SELECT bid_amount FROM bids
    WHERE auction_id = $1 AND user_id = $2
    ORDER BY bid_amount DESC
    LIMIT 1`,
    [auctionId,winnerId]
  );


  const amount = highestBidAmountRes.rows[0].bid_amount;

  await client.query(
    `UPDATE accounts SET balance = balance - $1 WHERE user_id = $2`,
    [amount,winnerId]
  );

   await client.query(
    `INSERT INTO transaction_logs (user_id, auction_id, amount, type, description)
     VALUES ($1, $2, $3, 'debit', 'Winning bid payment')`,
    [winnerId, auctionId, amount]
  );

  // 3. Refund others
  await client.query(
    `UPDATE accounts SET balance = balance + amount
     FROM locked_funds
     WHERE accounts.user_id = locked_funds.user_id
     AND auction_id = $1 AND user_id != $2`,
    [auctionId, winnerId]
  );

  await client.query(
    `INSERT INTO transaction_logs (user_id, auction_id, amount, type, description)
     SELECT user_id, auction_id, amount, 'refund', 'Bid refund (lost auction)'
     FROM locked_funds
     WHERE auction_id = $1 AND user_id != $2`,
    [auctionId, winnerId]
  );

  // 4. Update auction
  await client.query(
    "UPDATE auctions SET is_closed = true, winner_id = $1 WHERE id = $2",
    [winnerId, auctionId]
  );


  }else{
    await client.query(
      "UPDATE auctions SET is_closed = true WHERE id = $1",
      [auctionId]
    );
  }

  await client.query(`DELETE FROM locked_funds WHERE auction_id = $1`, [auctionId]);
  await client.query("COMMIT");


    res.status(200).json({ 
      message: "Auction ended successfully",
      winnerId: winnerId || "No bids placed" 
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error ending auction:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};





const profile = async(req,res) => {

try {
  const result = await client.query("SELECT name, email, phone, country,created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
} catch (error) {
  res.status(500).json({ message: "Failed to fetch user profile" });
}


}

const update = async(req,res) => {
const {name,phone,country} = req.body;
try {
      await client.query(  "UPDATE users SET name = $1, phone = $2, country = $3 WHERE id = $4",
      [name, phone, country, req.user.id] 
    );
        res.json({ message: "Profile updated successfully" });
} catch (error) {
     res.status(500).json({ message: "Update failed" });
}


}


const getParticipatedAuctions = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await client.query(
      `SELECT DISTINCT a.*
       FROM auctions a
       JOIN bids b ON a.id = b.auction_id
       WHERE b.user_id = $1
       ORDER BY a.end_time DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching participated auctions:", error.message);
    res.status(500).json({ message: "Failed to fetch participated auctions" });
  }
};





const getBiddingHistory = async (req,res) => {
  const userId = req.user.id;

try {
      const result = await client.query(
      `SELECT 
        b.bid_amount, b.created_at, 
        a.id AS auction_id, a.item_name, a.description, a.is_closed, a.end_time, a.current_price
       FROM bids b
       JOIN auctions a ON b.auction_id = a.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
} catch (error) {
      console.error("Error fetching bidding history:", error.message);
    res.status(500).json({ message: "Failed to fetch bidding history" });
}






}




const getWonAuctions = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await client.query(
      `SELECT a.*
       FROM auctions a
       WHERE a.winner_id = $1
       ORDER BY a.end_time DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching won auctions:", error.message);
    res.status(500).json({ message: "Failed to fetch won auctions" });
  }
};





module.exports = {
  createAuction,
  getActiveAuctions,
  placeBid,
  searchAuctions,
  getAuctionById,
  getUserAuctions,
  endAuction,
  profile,
update,
getParticipatedAuctions, 
getBiddingHistory,
getWonAuctions
};

