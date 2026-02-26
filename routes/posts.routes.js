const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { posts, replies, upvotes } = require("../db/store");
const auth = require("../middleware/auth.middleware");

const router = express.Router();
router.post("/posts", auth, (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text required" });
  }

  const newPost = {
    id: `p_${uuidv4()}`,
    text,
    authorId: req.user.id,
    createdAt: new Date().toISOString(),
    upvoteCount: 0,
    replyCount: 0
  };

  posts.push(newPost);

  res.status(201).json(newPost);
});
router.post("/posts/:id/replies", auth, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text required" });
  }

  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const reply = {
    id: `r_${uuidv4()}`,
    postId: id,
    authorId: req.user.id,
    text,
    createdAt: new Date().toISOString()
  };

  replies.push(reply);
  post.replyCount++;

  res.status(201).json(reply);
});
router.post("/posts/:id/upvote", auth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!upvotes.has(id)) {
    upvotes.set(id, new Set());
  }

  const postUpvotes = upvotes.get(id);

  let hasUpvoted;

  if (postUpvotes.has(userId)) {
    postUpvotes.delete(userId);
    hasUpvoted = false;
  } else {
    postUpvotes.add(userId);
    hasUpvoted = true;
  }

  post.upvoteCount = postUpvotes.size;

  res.json({
    postId: id,
    upvoteCount: post.upvoteCount,
    hasUpvoted
  });
});

router.get("/feed", (req, res) => {
  let { cursor, limit } = req.query;

  limit = Math.min(parseInt(limit) || 10, 50);

  // Sort newest first
  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  let startIndex = 0;

  if (cursor) {
    startIndex = sorted.findIndex(
      p => p.createdAt === cursor
    ) + 1;
  }

  const items = sorted.slice(startIndex, startIndex + limit);

  const nextCursor =
    items.length === limit
      ? items[items.length - 1].createdAt
      : null;

  res.json({
    items,
    nextCursor
  });
});
module.exports = router;