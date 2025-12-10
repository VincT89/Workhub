import twofactor from "node-2fa";
import qrcode from "qrcode";

/**
 * Genera un nuovo segreto per l'utente e produce anche il QR
 */
export const generate2FASecret = async (username) => {
  const secret = twofactor.generateSecret({
    name: "WorkHub",
    account: username,
  });

  // Genera QR code base64 a partire dall'URI
  const qr = await qrcode.toDataURL(secret.uri);

  return {
    secret: secret.secret, // da salvare su Mongo
    uri: secret.uri,       // otpauth://... compatibile con Authenticator
    qr,                    // immagine base64 da mostrare nel frontend
  };
};

/**
 * Verifica token inserito dall'utente
 */
export const verify2FAToken = (secret, token) => {
  return twofactor.verifyToken(secret, token);
};