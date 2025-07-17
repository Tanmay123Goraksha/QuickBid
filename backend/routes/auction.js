const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const auctionController = require("../controllers/auctionController");


router.get("/profile/participated-auctions", authenticateToken, auctionController.getParticipatedAuctions);
router.get("/profile", authenticateToken, auctionController.profile);
router.put("/profile/update", authenticateToken, auctionController.update);
router.get("/profile/bidding-history", authenticateToken, auctionController.getBiddingHistory);
router.get("/profile/won-auctions", authenticateToken, auctionController.getWonAuctions);

router.get("/active", auctionController.getActiveAuctions);
router.get("/search", auctionController.searchAuctions);
router.get("/my-auctions", authenticateToken, auctionController.getUserAuctions);
router.post("/create", authenticateToken, auctionController.createAuction);
router.post("/:id/bid", authenticateToken, auctionController.placeBid);
router.patch("/:id/end", authenticateToken, auctionController.endAuction);

// ⚠️ Keep this one LAST
router.get("/:id", auctionController.getAuctionById);




module.exports = router;