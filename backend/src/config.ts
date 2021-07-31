export const config = {
  PORT: process.env.PORT ?? "8080",
  ENV: process.env.NODE_ENV ?? "development",
  DB_LOGGING: process.env.DB_LOGGING ?? false,
};
