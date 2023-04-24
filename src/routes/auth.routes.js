import express from "express";
import {
  register,
  login,
  changePassword,
  getPsychologists
} from "../controllers/psychologist.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", changePassword);
router.get("/get-psychologists",getPsychologists);

export default router;
