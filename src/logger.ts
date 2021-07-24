import { createLogger, transports, format } from "winston";
import { config } from "./config";
import { join } from "path";
// @ts-ignore
import { LEVEL, MESSAGE } from "triple-beam";

const pretty = format((info: any) => {
  const { level } = info;
  if (info instanceof Error) {
    return {
      level: level,
      [LEVEL]: level,
      message: info.stack,
      [MESSAGE]: info.stack,
    };
  }
  return info;
});

const filename = join(process.cwd(), "logs", `${config.ENV}.log`);
const fileTransport = new transports.File({ filename });
const consoleTransport = new transports.Console();

export const logger = createLogger({
  format:
    config.ENV !== "production"
      ? format.combine(pretty(), format.simple())
      : format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json()
        ),
});

export const loggerMorgan = {
  write: (message: string) => logger.info(message.trim()),
};

if (config.ENV !== "production") {
  logger.add(fileTransport);
}

if (config.ENV !== "test") {
  logger.add(consoleTransport);
}
