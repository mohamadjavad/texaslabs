const express = require("express");
const router = express.Router();
const gameResultController = require("../controllers/gameResultController");

// Save a new game result
router.post("/", gameResultController.saveGameResult);

// Get game results for a specific user
router.get("/:userId", gameResultController.getUserGameResults);

module.exports = router;
