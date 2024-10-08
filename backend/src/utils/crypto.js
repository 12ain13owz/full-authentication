const config = require("config");
const crypto = require("crypto");
const { newError } = require("./helper");

const secret_key = config.get("secret_key");
const algorithm = "aes-256-gcm";
const key = Buffer.from(secret_key, "utf-8");
const iv = crypto.randomBytes(12);

const encrypt = (value) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(value, "utf-8", "base64");
    encrypted += cipher.final("base64");

    const tag = cipher.getAuthTag();
    const encryptedData = `${iv.toString("base64")}:${tag.toString(
      "base64"
    )}:${encrypted}`;

    return encryptedData;
  } catch (error) {
    throw newError(403, `encrypt, Invalid encryption`);
  }
};

const decrypt = (encryptedData) => {
  try {
    const [ivBase64, tagBase64, encryptedBase64] = encryptedData.split(":");
    const iv = Buffer.from(ivBase64, "base64");
    const tag = Buffer.from(tagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "base64", "utf-8");
    decrypted += decipher.final("utf-8");

    const decryptedData = JSON.parse(decrypted);
    return decryptedData;
  } catch (error) {
    throw newError(403, `decrypt, Invalid decryption`);
  }
};

const generateUniqueIdentifier = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = { encrypt, decrypt, generateUniqueIdentifier };
