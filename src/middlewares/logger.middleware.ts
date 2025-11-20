import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), 
    logFormat
  ),
  transports: [
    new transports.File({
      filename: "logs/completed.log",
      maxsize: 5242880,
      maxFiles: 5,
      tailable: true,
    }),

    new transports.File({
      level: "error",
      filename: "logs/error.log",
      maxsize: 5242880,
      maxFiles: 5,
      tailable: true,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(format.colorize(), logFormat),
    })
  );
}

export default logger;