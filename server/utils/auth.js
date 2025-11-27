import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getPrivateKey = () => process.env.SERVER_PRIVATE_KEY; // Chiave segreta per JWT, da .env

/**
 * Hash password  con bcrypt
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Confronta password con hash bcrypt
 */
export const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed); // Restituisce true la password corrisponde all'hash, altrimenti false
};

/**
 * Genera token JWT
 */
export const generateAccessToken = (payload, expiresIn = "8h") => { // il token scade in 8 ore di default, si rigenera effettuando di nuovo il login
  const key = getPrivateKey();

  if (!key) {
    throw new Error("SERVER_PRIVATE_KEY non definita nelle env");
  }

  return jwt.sign(payload, key, { expiresIn }); // Genera il token con il payload e la chiave segreta
};

/**
 * Verifica token
 */
export const verifyAccessToken = (token) => {
  const key = getPrivateKey();

  if (!key) {
    throw new Error("SERVER_PRIVATE_KEY non definita nelle env");
  }

  return jwt.verify(token, key);
};

/**
 * Password temporanea generata casualmente che include lettere maiuscole, minuscole, numeri e simboli e ha una lunghezza di 10 caratteri di default, poi può essere cambiata dall'utente
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
