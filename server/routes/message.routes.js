import express from "express";
import ProtectRoute from "../middlewares/protectedRoute.js";
import {
  getAllMessage,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.post("/send/:id", ProtectRoute, sendMessage);

router.get("/:id", ProtectRoute, getAllMessage);

export default router;
