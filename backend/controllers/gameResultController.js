const GameResult = require("../models/GameResult");

// Save a new game result
exports.saveGameResult = async (req, res) => {
  try {
    const { userId, score, time, moves } = req.body;

    const gameResult = new GameResult({
      userId,
      score,
      time,
      moves,
    });

    await gameResult.save();

    res.status(201).json({
      success: true,
      data: gameResult,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get game results for a specific user
exports.getUserGameResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching game results for user:", userId);

    // First check if any results exist for this user
    const count = await GameResult.countDocuments({ userId });
    console.log("Total results found:", count);

    if (count === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No game results found for this user",
      });
    }

    const gameResults = await GameResult.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    console.log("Found game results:", gameResults);
    res.status(200).json({
      success: true,
      data: gameResults,
    });
  } catch (error) {
    console.error("Error fetching game results:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
