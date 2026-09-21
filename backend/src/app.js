import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* VERY IMPORTANT — ignore socket.io path */
app.use((req, res, next) => {
  if (req.path.startsWith("/socket.io")) return next();
  next();
});

/* your api routes */
app.use("/api", routes);

export default app;