# Assignment Project

This repository contains a simple Express.js application simulating a social feed with posts, replies, and upvotes.

## 🚀 Running the Project

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the server**
   ```bash
   node index.js
   ```
3. The app listens on port `3000`. You can use `curl` or Postman to interact with the endpoints.

## 🔁 Cursor Pagination (Feed Endpoint)

- Endpoint: `GET /feed`
- Query parameters:
  - `limit` (optional) – number of items (1‑50, default 10)
  - `cursor` (optional) – the `createdAt` timestamp of the last item from a previous page

**How it works:**
1. Posts are sorted in descending order by `createdAt` (newest first).
2. If a `cursor` is provided, the server finds its index in the sorted list and starts the next page *after* that item.
3. A slice of length `limit` is returned.
4. If the slice length equals `limit`, the response includes `nextCursor` containing the `createdAt` of the last returned post; otherwise `nextCursor` is `null`.

This pattern allows clients to page through the feed efficiently without skipping or duplicating items.

## ✅ Upvote Uniqueness

- Upvotes are stored in a `Map` keyed by `postId`, with each value being a `Set` of `userId`s.
- When a user upvotes, their ID is added to the set; if they upvote again, the ID is removed (toggle behavior).
- The use of a `Set` guarantees each user can only appear once per post, ensuring uniqueness.
- The `upvoteCount` on the post is simply the size of the corresponding set.

## 🗄️ Production Database Recommendation

For a production-ready system, I'd choose **PostgreSQL** (or a similar relational database) for several reasons:

1. **Strong consistency and transactions** – important when multiple users interact with posts, replies, and upvotes simultaneously.
2. **Query flexibility** – pagination, filtering, and aggregations are easily handled with SQL.
3. **Foreign keys and schema** – ensure data integrity between users, posts, replies, etc.
4. **Scalability** – PostgreSQL scales well vertically and has replication support.
