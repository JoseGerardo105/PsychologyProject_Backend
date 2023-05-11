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
  getPatientId,
  createPatient,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deletePatient,
  getMedicalRecordId
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
router.delete("/delete-appointment/:eventId", deleteAppointment);
router.patch("/update-appointment/:eventId", updateAppointment);
router.patch("/update-appointment-form/:eventId", updateAppointment);

router.get("/get-patients", getPatients);
router.get("/get-patient/:patientId", getPatientId);
router.post("/create-patients", createPatient);
router.delete("/delete-patient/:patientId", deletePatient);

router.get("/get-medical-records", getMedicalRecords);
router.get("/get-medical-record/:medicalRecordId", getMedicalRecordId);
router.post("/create-medical-records", createMedicalRecord);
router.patch("/update-medical-records/:medicalRecordId", updateMedicalRecord);
router.delete("/delete-medical-record/:medicalRecordId", deleteMedicalRecord);

export default router;
