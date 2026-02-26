const express = require("express");
const router = express.Router();

router.post("/mock", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId required" });
  }

  return res.json({
    token: `mock-${userId}`
  });
});

module.exports = router;