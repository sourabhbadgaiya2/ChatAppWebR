import path from "path";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import usersRoutes from "./routes/user.routes.js";
import ErrorHandler from "./utils/ErrorHandlers.js";
import authRoutes from "./routes/userAuth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import generatedError from "./middlewares/generatedError.js";

// Load .env file
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./.env"),
});

const app = express();

// body parser and middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

//session & cookie Parser
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SES_SEC,
  })
);

app.use(cookieParser());

//!routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);

//! Error Handler
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`req url not found ${req.url}`), 404);
});

app.use(generatedError);

//!server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`server running on PORT: ${PORT}`);
});
