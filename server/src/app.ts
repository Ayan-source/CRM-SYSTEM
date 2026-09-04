import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/error";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
