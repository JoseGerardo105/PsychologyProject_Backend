import express from "express";
import {
  register,
  login,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
  confirmAccount
} from "../controllers/psychologist.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/confirm/:token',confirmAccount);
router.patch("/change-password/", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);

router.get("/get-psychologists", getPsychologists);


export default router;
