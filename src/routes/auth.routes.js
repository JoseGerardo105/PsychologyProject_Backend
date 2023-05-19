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
  updatePatient,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deletePatient,
  getMedicalRecordId,
  updateAppointmentForm,
} from "../controllers/psychologist.controller.js";
import authentication from "../middleware/authenticate.middleware.js";

const router = express.Router();

//URLs públicas
router.post("/register", register);
router.get("/confirm/:token", confirmAccount);
router.post("/login", login);
router.patch("/change-password", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);

//URLs manejo de citas
router.get("/get-appointments", getAppointments);
router.post("/create-appointment", createAppointment);
router.patch("/update-appointment/:eventId", updateAppointment);
router.patch("/update-appointment-form/:eventId", updateAppointmentForm);
router.delete("/delete-appointment/:eventId", deleteAppointment);


//URLs manejo de pacientes
router.post("/create-patients", createPatient);
router.get("/get-patients", getPatients);
router.get("/get-patient/:patientId", getPatientId);
router.patch("/update-patient/:patientId", updatePatient);
router.delete("/delete-patient/:patientId", deletePatient);

//URLs manejo de historias
router.post("/create-medical-records", createMedicalRecord);
router.get("/get-medical-record/:medicalRecordId", getMedicalRecordId);
router.patch("/update-medical-records/:medicalRecordId", updateMedicalRecord);
router.delete("/delete-medical-record/:medicalRecordId", deleteMedicalRecord);


//Para que?
//Se requiere cuenta para mostrar estas páginas
router.get("/profile", authentication, profile);
router.get("/get-medical-records", getMedicalRecords);
router.get("/get-psychologists", getPsychologists);

export default router;
