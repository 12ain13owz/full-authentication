const config = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || "development",
  secret_key: process.env.SECRET_KEY || "",
  whitelist: process.env.WHITELIST || "",
  db: {
    uri: process.env.DB_URI || "",
    name: process.env.DB_NAME || "",
    dialect: process.env.DB_DIALECT || "",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "maddison53@ethereal.email",
      pass: process.env.SMTP_PASS || "jn7jnAPss4f63QBp6D",
    },
  },
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY || "",
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || "",
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY || "",
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || "",
};

module.exports = config;
