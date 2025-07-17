const verifyAdmin = require("../middleware/adminMiddleware");
const client = require("../db/db");


const usersSearch = async (req,res) => {
const search = req.query.search;

try {
    const result = await client.query(
      `SELECT u.id, u.name, u.email, a.balance
       FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       WHERE u.name ILIKE $1 OR u.email ILIKE $1
       ORDER BY u.created_at DESC`,
      [`%${search}%`]
    )
    res.json(result.rows);
} catch (error) {
    console.log("Admin User error",error.message);
    res.status(500).json({ message: "Server error" });
}



}




const addFunds = async (req,res) => {
const {userId, amount} = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid user ID or amount" });
  }

  try {

await client.query("BEGIN");

    await client.query(
      `UPDATE accounts SET balance = balance + $1 WHERE user_id = $2`,
      [amount, userId]
    );


        await client.query(
      `INSERT INTO transaction_logs (user_id, amount, type, description)
       VALUES ($1, $2, 'credit', 'Funds added by admin')`,
      [userId, amount]
    );



    await client.query("COMMIT");
      res.status(200).json({ message: `Added ₹${amount} to user ID ${userId}` });

    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Add funds error:", error.message);
    res.status(500).json({ message: "Server error while adding funds" });

  }



}
const deductFunds = async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid user ID or amount" });
  }

  try {
    const balanceRes = await client.query(
      `SELECT balance FROM accounts WHERE user_id = $1`,
      [userId]
    );
    const balance = balanceRes.rows[0]?.balance || 0;

    if (balance < amount) {
      return res.status(400).json({ message: `Insufficient balance (₹${balance})` });
    }

    await client.query("BEGIN");

    await client.query(
      `UPDATE accounts SET balance = balance - $1 WHERE user_id = $2`,
      [amount, userId]
    );

    await client.query(
      `INSERT INTO transaction_logs (user_id, amount, type, description)
       VALUES ($1, $2, 'debit', 'Funds deducted by admin')`,
      [userId, amount]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: `Deducted ₹${amount} from user ID ${userId}` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Deduct funds error:", error.message);
    res.status(500).json({ message: "Server error while deducting funds" });
  }
};




module.exports = {
    usersSearch,
    addFunds,
    deductFunds
}