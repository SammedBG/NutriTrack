import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";

if (!JWT_SECRET) {
  console.error("JWT_SECRET is required in env");
  process.exit(1);
}

/**
 * requireAuth middleware:
 * - checks httpOnly cookie first
 * - falls back to Authorization header Bearer token
 * - sets req.userId if valid
 */
export default function requireAuth(req, res, next) {
  try {
    const tokenFromCookie = req.cookies?.[COOKIE_NAME];
    const authHeader = req.headers.authorization;
    let token = tokenFromCookie;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) return res.status(401).json({ error: "Authentication required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
