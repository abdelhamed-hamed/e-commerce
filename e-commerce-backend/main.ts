import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/database";
import mainRoutes from "./src";

const app: express.Application = express();
app.use(express.json({ limit: "5kb" }));

dotenv.config();

// Connected to database
dbConnection;

// main Route
mainRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
