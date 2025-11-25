import { formatResponse } from './format.js';

/**
 * Handle routes errors
 * @param {Response} res 
 * @param {object} param1 
 * @param {Error} param1.error 
 * @param {string} param1.message 
 * @param {number} param1.code 
 * @returns {Response} 
 */
export const handleRouteErrors = (res, { error, message = "Internal Server Error", code = 500 }) => {
  console.log(error);
  
  return res.status(code).json(formatResponse(null, false, message));
}