import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = mongoose
  .connect(process.env.DB!)
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.error("Failed to connect");
  });

export default dbConnection;
