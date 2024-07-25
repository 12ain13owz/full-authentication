if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.dev" });
} else if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.prod" });
}

const config = require("config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const log = require("./utils/logger");
const routesV1 = require("./routes/v1");
const errorHandler = require("./middlewares/error-handler.middleware");
const models = require("./models");

const app = express();
const port = config.get("port");
const whitelist = config.get("whitelist").split(",");

const corsOptions = {
  origin: whitelist,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../public")));

app.use(routesV1);
app.use(errorHandler);

const main = async () => {
  try {
    await models.sequelize.sync({ alter: true });

    log.info("Database connected successfully");
    log.info(`Server listening at http://localhost:${port}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

app.listen(port, main);
