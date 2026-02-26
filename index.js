const express = require("express");
const app = express();

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/", require("./routes/posts.routes"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});