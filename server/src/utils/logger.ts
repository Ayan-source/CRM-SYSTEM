import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack, method, url, status, responseTime }) => {
  let msg = `${timestamp} ${level}`;

  if (method && url) {
    msg += ` ${method} ${url}`;
  }

  if (status) {
    const statusStr = String(status);
    if (status >= 200 && status < 300) {
      msg += ` \x1b[32m${statusStr}\x1b[0m`;
    } else if (status >= 300 && status < 400) {
      msg += ` \x1b[33m${statusStr}\x1b[0m`;
    } else {
      msg += ` \x1b[31m${statusStr}\x1b[0m`;
    }
  }

  if (responseTime) {
    msg += ` \x1b[36m${responseTime}\x1b[0m`;
  }

  if (stack) {
    msg += `\n${stack}`;
  } else {
    msg += ` ${message}`;
  }

  return msg;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "http",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: combine(
    timestamp({ format: "HH:mm:ss" }),
    errors({ stack: true })
  ),
  defaultMeta: { service: "crm-api" },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), winston.format.json()),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), devFormat),
    })
  );
}

export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
