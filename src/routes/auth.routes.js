import express from "express";
import {
  register,
  login,
  profile,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
  getAPsychologist,
  confirmAccount,
  getAdminPatients,
  getPsychologystPatients,
  getPatientId,
  createPatient,
  updatePatient,
  getAdminAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAdminMedicalRecords,
  getPsychologistMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  deletePatient,
  getMedicalRecordId,
  updateAppointmentForm,
  getPatientIdWithDocument,
  getMedicalRecordByDocument,
  getUserAppointments,
  getPatientsByAge,
  getPsychologistPatientsByAge,
  getAdminIncomeByAppointments,
  getPsyichologistIncomeByAppointments
} from "../controllers/psychologist.controller.js";
import authentication from "../middleware/authenticate.middleware.js";

const router = express.Router();

//URLs públicas
router.post("/register", register);
router.get("/confirm/:token", confirmAccount);
router.post("/login", login);
router.patch("/change-password", forgetPassword);
router.route("/change-password/:token").get(checkToken).post(newPassword);
router.get("/get-psychologists", getPsychologists);
router.get("/get-a-psychologist/:email", getAPsychologist);

//Se requiere cuenta para mostrar estas páginas
//URLs manejo de citas
router.get("/get-user-appointments", authentication, getUserAppointments);
router.get("/get-admin-appointments", getAdminAppointments);
router.post("/create-appointment", createAppointment);
router.patch("/update-appointment/:eventId", updateAppointment);
router.patch("/update-appointment-form/:eventId", updateAppointmentForm);
router.delete("/delete-appointment/:eventId", deleteAppointment);

//URLs manejo de pacientes
router.post("/create-patients", createPatient);
router.get("/get-admin-patients", getAdminPatients);
router.get("/get-psychologist-patients/:psychologistEmail", getPsychologystPatients);
router.get("/get-patient/:patientId", getPatientId);
router.get("/get-patient-with-doc/:patientDoc", getPatientIdWithDocument);
router.patch("/update-patient/:patientId", updatePatient);
router.delete("/delete-patient/:patientId", deletePatient);

//URLs manejo de historias
router.post("/create-medical-records", createMedicalRecord);
router.get("/get-admin-medical-records", getAdminMedicalRecords);
router.get("/get-psychologist-medical-records/:psychologistEmail", getPsychologistMedicalRecords);
router.get("/get-medical-record/:medicalRecordId", getMedicalRecordId);
router.get("/get-medical-record-with-doc/:document",getMedicalRecordByDocument);
router.patch("/update-medical-records/:medicalRecordId", updateMedicalRecord);
router.delete("/delete-medical-record/:medicalRecordId", deleteMedicalRecord);

//URLs generación de reportes
router.get("/get-patients-by-age-admin", getPatientsByAge);
router.get("/get-patients-by-age-user/:email", getPsychologistPatientsByAge);
router.get("/get-income-by-appointments-psychologist", getPsyichologistIncomeByAppointments);
router.get("/get-income-by-appointments-admin", getAdminIncomeByAppointments);



router.get("/profile", authentication, profile);


export default router;
