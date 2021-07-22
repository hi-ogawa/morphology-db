import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
// import { terser } from "rollup-plugin-terser";

export default {
  input: "src/server/main.ts",
  output: {
    file: "build-rollup/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript({ module: "esnext" }),
    json(),
    resolve(),
    commonjs({
      dynamicRequireTargets: [
        // Workaround circular dependency (not sure how this is supposed to work...)
        "node_modules/readable-stream/**/*.js",
        "node_modules/winston-transport/**/*.js",
      ],
      ignore: [
        // Unused drivers for typeorm
        "@sap/hana-client",
        "mongodb",
        "mysql",
        "hdb-pool",
        "oracledb",
        "mysql2",
        "pg-native",
        "redis",
        "pg",
        "pg-query-stream",
        "typeorm-aurora-data-api-driver",
        "ioredis",
        "better-sqlite3",
        "sql.js",
        "mssql",
        "react-native-sqlite-storage",
      ],
    }),
    // terser(),
  ],
};
