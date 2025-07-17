const bcrypt = require("bcryptjs")
const client = require("../db/db");
const generateToken = require("../utils/generateToken");

const ADMIN_EMAIL = "admin@quickbid.com";
const ADMIN_PASSWORD = "tanmay$123456";


const registerUser = async (req,res) => {

const {name, email, password} = req.body;

try {
    
const userExists = await client.query("Select * from users Where email = $1",[email]);
if(userExists.rows.length > 0){
    return res.status(400).json({message: "User Exists"});
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

await client.query("BEGIN");


const userResult = await client.query(
  "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
  [name, email, hashedPassword]
);



const userId = userResult.rows[0].id;

await client.query(

    "Insert INTO accounts (user_id, balance) VALUES ($1,$2)",
[userId,0]
);

await client.query("COMMIT");

res.status(201).json({message: "User successfully registered"});



} catch (error) {
    await client.query("ROLLBACK");
        console.error(error.message);
    res.status(500).json({ message: "Server error during registration" });
}

}



const loginUser = async(req,res) => {
const {email,password} = req.body;


try {
    const userRes = await client.query("Select * from users where email = $1",[email]);

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRes.rows[0];


    const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch){
    return res.status(400).json({message:"Invalid email or password"});
}

 
    const token = generateToken(user);
    const isAdmin = user.email === "admin@quickbid.com";

    
       res.status(200).json({ 
      message: "Login successful", 
      userId: user.id, 
      token: token ,
      isAdmin: isAdmin
    });


} catch (error) {
      console.error(err.message);
    res.status(500).json({ message: "Server error" });  
}


}

module.exports = {
    registerUser,
    loginUser,
}