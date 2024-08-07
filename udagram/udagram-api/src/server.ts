import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { sequelize } from "./sequelize";

import { IndexRouter } from "./controllers/v0/index.router";

import bodyParser from "body-parser";
import { V0_FEED_MODELS, V0_USER_MODELS } from "./controllers/v0/model.index";

(async () => {
  dotenv.config();
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
  console.log('POSTGRES_USERNAME:', process.env.POSTGRES_USERNAME);
  console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
  console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
  console.log('JWT_SECRET', process.env.JWT_SECRET)
  
  console.log("Starting database connection...");

  try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
  } catch (error) {
      console.error("Unable to connect to the database:", error);
  }

  await sequelize.addModels(V0_FEED_MODELS);
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  console.log("Database Connected");

  const app = express();
  const port = 8080;
  
  app.use(cors());
  app.use(bodyParser.json());
  app.options('*', cors()) // enable pre-flight requests  

  app.use("/api/v0/", IndexRouter);

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running ${process.env.URL}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
