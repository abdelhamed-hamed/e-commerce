import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/database";
import mainRoutes from "./src";
import path from "path";
import hpp from "hpp";
import i18n from "i18n";
import { Server } from "http";

const app: express.Application = express();
app.use(express.json({ limit: "5kb" }));
app.use(express.static("src/uploads"));
let server: Server;

dotenv.config();
// i18n Configure
i18n.configure({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  queryParameter: "lang",
});
app.use(i18n.init);
app.use(hpp({ whitelist: ["price"] }));
// Connected to database
dbConnection;

// main Route
mainRoutes(app);

server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`unhandledRejection ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting the application down");
    process.exit(1);
  });
});
