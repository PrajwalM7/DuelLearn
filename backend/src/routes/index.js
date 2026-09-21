import express from "express";
import userRoutes from "./userRoutes.js";
import questionRoutes from "./question.routes.js";
import loginRoutes from "./login.Routes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);        
router.use("/questions", questionRoutes); 
router.use("/auth", loginRoutes);        
router.use("/dashboard", dashboardRoutes);
router.use("/ai", aiRoutes);
export default router;