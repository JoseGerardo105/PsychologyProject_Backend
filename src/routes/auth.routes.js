import express from "express";
import {
  register,
  login,
  mainPanel,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
  confirmAccount
} from "../controllers/psychologist.controller.js";
import authentication from '../middleware/authenticate.middleware.js';

const router = express.Router();


//URLs públicas
router.post("/register", register);
router.post("/login", login);
router.get('/confirm/:token',confirmAccount);
router.patch("/change-password/", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);

//Se requiere cuenta para mostrar estas páginas
router.get("/main-panel", authentication, mainPanel);
router.get("/get-psychologists", getPsychologists);


export default router;
