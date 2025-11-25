/**
 * Format response object for consistency
 * @param {*} data
 * @param {boolean} [success]  // le quadre in questo caso success e' opzionale (con le quadre)
 * @param {string} [message]
 * @returns
 */

export const formatResponse = (data, success = true, message = "OK") => {
	return {
		success,
		data,
		message,
	};
};
