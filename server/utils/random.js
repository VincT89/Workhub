/**
 * Generate random card number
 * @param {number} length 
 * @returns {string}
 */
export const generateRandomCardNumber = (length = 6, appendTimestamp = true) => {
    const chars = '0123456789';
    let cardNumber = '';
    for (let i = 0; i < length; i++) {
        cardNumber += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return appendTimestamp ? `${Date.now()}-${cardNumber}` : cardNumber;
}