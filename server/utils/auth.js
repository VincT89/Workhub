import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hash input password
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
	return await bcrypt.hash(password, 8);
};

/**
 * Compare hashed password
 * @param {string} password
 * @param {string} hashPassword
 * @returns {Promise<boolean>}
 */

export const comparePassword = async (password, hashPassword) => {
	return await bcrypt.compare(password, hashPassword);
};


/**
 * Generate JWT token
 * @param {object} payload 
 */
export const generateAccessToken = async (payload) => {
	return new Promise((resolve, reject) => {
		try {
			const token = jwt.sign(payload, process.env.SERVER_PRIVATE_KEY, {
				issuer: "User",
				expiresIn: "1d",
			});
			return resolve(token);
		} catch (error) {
			return reject(error);
		}
	});
};

export const verifyAccessToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decodedToken = jwt.verify(token, process.env.SERVER_PRIVATE_KEY);
      return resolve(decodedToken);
    } catch (error) {
      return reject(error);
    }
  })
}
