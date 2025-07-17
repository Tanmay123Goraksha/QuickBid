const express = require("express");
const router = express.Router();
const { usersSearch } = require("../controllers/adminController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController")

router.get("/search", authenticateToken, verifyAdmin, usersSearch);
router.post("/funds/add", authenticateToken, verifyAdmin, adminController.addFunds);
router.post("/funds/deduct", authenticateToken, verifyAdmin, adminController.deductFunds);


module.exports = router;