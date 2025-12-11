const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db/db');  // Use require for CommonJS
const userRoutes = require('./routes/routes'); // Use require for routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  "http://localhost:5181",
  "http://localhost:5182",
  "http://localhost:5183",
  "http://localhost:5184",
  "http://localhost:5185",
  "http://localhost:5186",
  "http://localhost:5187",
  "http://localhost:5188",
  "http://localhost:5189",
  "http://localhost:5190",
  "http://localhost:5191",
  "http://localhost:5192",
  "http://localhost:5193",
  "http://localhost:5194",
  "http://localhost:5195"
];

console.log("⭐ Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // ← Important
  })
);

// Use routes
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("API running…");
});



app.listen(PORT, () => {
  console.log(`🚀  API running at http://localhost:${PORT}`);
});
