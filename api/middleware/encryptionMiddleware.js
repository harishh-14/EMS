import CryptoJS from "crypto-js";
import { MESSAGES } from "../constants/constants.js";
import logger from "../utils/logger.js";

const SECRET_KEY = process.env.CRYPTO_SECRET;

// 🔑 Flag from env (true/false)
const ENCRYPTION_ENABLED = process.env.ENCRYPTION_ENABLED === "true";

// 🔑 Middleware to decrypt incoming request
export const decryptRequest = (req, res, next) => {
  const apiName = "DECRYPT_REQUEST_MIDDLEWARE";
  try {
    if (ENCRYPTION_ENABLED && req.body && req.body.payload) {
      logger.info("Decrypting request payload", { api: apiName });

      console.log(req.body);
      const bytes = CryptoJS.AES.decrypt(req.body.payload, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      console.log(decrypted);
      req.body = decrypted; // replace encrypted data with decrypted object

      logger.info("Request decrypted successfully", {
        api: apiName,
        decryptedKeys: Object.keys(decrypted), // log only keys, not sensitive values
      });
    } else {
      logger.debug("Decryption skipped (encryption disabled or no payload)", {
        api: apiName,
      });
    }

    next();
  } catch (error) {
    logger.error("Error decrypting request", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("❌ Error decrypting request:", error);
    return res.status(400).json({
      success: false,
      message: MESSAGES.DECRYPT.INVALID_ENCRYPTED,
    });
  }
};

// 🔑 Middleware to encrypt outgoing response
export const encryptResponse = (req, res, next) => {
  const apiName = "ENCRYPT_RESPONSE_MIDDLEWARE";

  // override res.json
  const originalJson = res.json;
  res.json = function (data) {
    try {
      if (ENCRYPTION_ENABLED) {
        logger.info("Encrypting response", { api: apiName });

        const ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          SECRET_KEY
        ).toString();

        logger.info("Response encrypted successfully", {
          api: apiName,
          length: ciphertext.length, // log length not actual cipher
        });

        logger.debug("Encryption skipped (encryption disabled)", {
          api: apiName,
        });
        return originalJson.call(this, { payload: ciphertext });
      }
      // Agar flag false hai to plain json bhej do
      return originalJson.call(this, data);
    } catch (error) {
      logger.error("Error encrypting response", {
        api: apiName,
        message: error.message,
        stack: error.stack,
      });

      console.error("❌ Error encrypting response:", error);
      return originalJson.call(this, data); // fallback send plain
    }
  };
  next();
};
