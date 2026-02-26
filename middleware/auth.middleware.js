module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  console.log(token,"token",header);
  
  if (!token || !token.startsWith("mock-")) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = token.replace("mock-", "");
  req.user = { id: userId };

  next();
};