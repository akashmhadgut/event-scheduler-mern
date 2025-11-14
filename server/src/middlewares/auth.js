import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // Check header exists
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided or invalid format" });
    }

    // Extract token
    const token = header.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { _id: decoded.id, email: decoded.email };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Token invalid or expired" });
  }
};
