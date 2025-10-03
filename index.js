import dotenv from "dotenv";
import cors from "cors";

import express from "express";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
await connectDB();

app.use(express.json());
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("Todo is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
