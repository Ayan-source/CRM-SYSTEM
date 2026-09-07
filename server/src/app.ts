import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/index.js";
import logger, { stream } from "./utils/logger.js";
import { errorHandler } from "./middleware/error.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import leadRoutes from "./routes/lead.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

morgan.token("status-color", (req, res) => {
  const status = res.statusCode;
  if (status >= 200 && status < 300) return `\x1b[32m${status}\x1b[0m`;
  if (status >= 300 && status < 400) return `\x1b[33m${status}\x1b[0m`;
  return `\x1b[31m${status}\x1b[0m`;
});

morgan.token("method-color", (req) => {
  return `\x1b[36m${req.method}\x1b[0m`;
});

app.use(
  morgan(
    ":method-color :url :status-color :response-time[0]ms",
    { stream }
  )
);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
