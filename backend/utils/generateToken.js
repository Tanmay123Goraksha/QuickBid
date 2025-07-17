const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const isAdmin = user.email === "admin@quickbid.com"; 

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      is_admin: isAdmin
    },
    "your_jwt_secret_key",
    { expiresIn: "2h" }
  );
};

module.exports = generateToken;
