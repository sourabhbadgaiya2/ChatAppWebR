import express from "express";
import ProtectRoute from "../middlewares/protectedRoute.js";
import { getUserForSideBar } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", ProtectRoute, getUserForSideBar);

export default router;
