const posts = [];
const replies = [];
const upvotes = new Map(); 
// key: postId
// value: Set(userId)

module.exports = {
  posts,
  replies,
  upvotes
};