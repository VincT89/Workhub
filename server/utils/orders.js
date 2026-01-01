import { AppConfig } from "../config/app.js"

const { affiliate } = AppConfig;

/**
 * Calcola i puinti affiliazione in base all'ammontare dell'ordine e al tipo di affiliazione
 * @param {number} orderAmount 
 * @param {string} affiliateType 
 * @returns {number} punti affiliato calcolati
 */
export const calculateAffiliatePoints = (orderAmount, affiliateType = "standard") => {
    if (typeof orderAmount !== 'number' || orderAmount < 0) return 0;
    if (!affiliateType || !affiliate[affiliateType]) affiliateType = "standard";

    const { AFFILIATE_POINTS_FOREACH_UNIT, AFFILIATE_POINTS_UNIT } = affiliate[affiliateType] || affiliate["standard"];

    const isElegible = orderAmount >= AFFILIATE_POINTS_UNIT;
    if (!isElegible) return 0;

    return Math.floor(orderAmount / AFFILIATE_POINTS_UNIT) * AFFILIATE_POINTS_FOREACH_UNIT;
}

// Per chi deve creare l'ordine 
// 1. Creo l'ordine e associo eventuali utenti
// 2. Per ogni cliente (se presenti) estraggo i dati del programma affiliazione
// 3. Calcolo i punti in base all'ammontare dell'ordine e al tipo di affiliazione (usa la funzione calculateAffiliatePoints che RESTITUISCE i punti calcolati)
// 4. Vado ad aggiornare la collection AffiliateProgram sommando i punti calcolati a quelli precedenti usando l'operatore di mongoose $inc (vedi documentazione mongoose per $inc)