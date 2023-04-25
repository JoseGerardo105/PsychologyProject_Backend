import express from "express";
import {
  register,
  login,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists
} from "../controllers/psychologist.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password/", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);

router.get("/get-psychologists", getPsychologists);

export default router;
