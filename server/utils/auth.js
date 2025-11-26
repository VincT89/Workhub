import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hash password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10); // 10 è uno standard buono
};

/**
 * Confronta password
 */
export const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

/**
 * Genera JWT
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SERVER_PRIVATE_KEY, {
    issuer: "WorkHub",
    expiresIn: "1d",
  });
};

/**
 * Verifica JWT
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.SERVER_PRIVATE_KEY);
};

/**
 * Genera password temporanea
 */
export const generateTempPassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};
