import express from "express";
import {
  register,
  login,
  profile,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
  confirmAccount,
  getPatients,
  getAppointments,
  createAppointment,
} from "../controllers/psychologist.controller.js";
import authentication from "../middleware/authenticate.middleware.js";

const router = express.Router();

//URLs públicas
router.post("/register", register);
router.post("/login", login);
router.get("/confirm/:token", confirmAccount);
router.patch("/change-password/", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);

//Se requiere cuenta para mostrar estas páginas
router.get("/profile", authentication, profile);
router.get("/get-psychologists", getPsychologists);

router.get("/get-appointments", getAppointments);
router.post("/create-appointment", createAppointment);

router.get("/get-patients", getPatients);

export default router;
