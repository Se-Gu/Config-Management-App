import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import panel from "./routes/panel";
import mobileClients from "./routes/mobileClients";
import { connectRedis } from "./config/redisClient";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);

app.use("/api/panel", panel);
app.use("/api/mobileClients", mobileClients);

(async () => {
  await connectRedis();
})();

export default app;
