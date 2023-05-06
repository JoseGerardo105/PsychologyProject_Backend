import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import generateToken from "../helpers/generateToken.js";
import confirmationEmail from "../helpers/confirmationEmail.js";

const checkUserByEmail = async (email) => {
  const result = await connectDB.query(
    "SELECT * FROM psychologists WHERE email = ?",
    email
  );

  return result[0];
};

const checkUserByToken = async (token) => {
  const result = await connectDB.query(
    "SELECT * FROM psychologists WHERE token = ?",
    [token]
  );

  return result[0];
};

const checkUserConfirmation = async (email) => {
  const result = await connectDB.query(
    "SELECT * FROM psychologists WHERE email = ? and confirmed = ?",
    [email, 1]
  );
  return result[0];
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const token = generateToken();
  // Validar la información del usuario
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "La contraseña requiere un mínimo de 8 caracteres" });
  }

  try {
    const result = await checkUserByEmail(email);

    if (result.length > 0) {
      res
        .status(409)
        .json({ error: "Ya existe una cuenta asociada al correo ingresado" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const [rows] = await connectDB.query(
        "INSERT INTO psychologists(name,email,password,token) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, token]
      );

      //Crear instancia de la creación del correo
      const mailInformation = confirmationEmail({
        name,
        email,
        token,
      });

      res.status(201).json({
        message: "Psicólogo registrado correctamente",
        id: rows.insertId,
        name,
        email,
        hashedPassword,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;
  const result = await checkUserByToken(token);

  if (result.length === 0) {
    const error = new Error("Token inválido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    connectDB.query(
      "UPDATE psychologists SET token = ?, confirmed = ? WHERE token = ?",
      [null, 1, token]
    );

    return res.status(200).json({ msg: "Cuenta confirmada" });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const getPsychologists = async (req, res) => {
  // prueba base de datos
  const result = await connectDB.query("SELECT * from psychologists");
  res.json(result[0]);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validar la información del usuario
  if (!email || !password) {
    return res.status(400).json({ error: "Se requiere email y contraseña" });
  }

  //Comprobar si el email ingresado existe
  const result = await checkUserByEmail(email);
  if (result.length === 0) {
    res.status(401).json({ error: "La cuenta con la dirección email ingresada no existe" });
  }

  //Comprobar si la cuenta ya está confirmada
  const resultConfirmation = await checkUserConfirmation(email);
  if (resultConfirmation.length === 0) {
    return res.status(401).json({ error: "Usuario aún no confirmado" });
  }

  //Autenticar el usuario
  try {
    const isPasswordValid = await bcrypt.compare(password, result[0].password);

    if (isPasswordValid) {
      //Autenticar el usuario
      const token = jwt.sign({ id: result[0].id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const profile = (req, res) => {
  const { body } = req;
  res.json({ profile: body });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  //Verificar la existencia de un usuario con determinado email
  try {
    const result = await checkUserByEmail(email);
    if (result.length === 0) {
      const error = new Error("El usuario no existe");
      res.status(404).json({ msg: error.message });
    } else {
      //Si el usuario existe generamos un Token que se envía al correo
      const token = generateToken();
      await connectDB.query(
        "UPDATE psychologists SET token = ? WHERE id = ?",
        [token, result[0].id]
      );

      res.status(200).json({ msg: "Se ha enviado un correo para reestablecer cuenta" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const result = await checkUserByToken(token);
  if (result.length === 0) {
    const error = new Error("Token inválido");
    res.status(400).json({ message: error.message });
  } else {
    res.json({ msg: "Token válido" });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const newToken = null;
  const { password } = req.body;

  //Comprobar el token
  const result = await checkUserByToken(token);
  if (result.length === 0) {
    const error = new Error("Token inválido");
    return res.status(400).json({ message: error.message });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "La contraseña requiere un mínimo de 8 caracteres" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectDB.query(
      "UPDATE psychologists SET token = ?, password = ? WHERE token = ?",
      [newToken, hashedPassword, token]
    );
    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    res.status(401).json({ error: "Error al cambiar la contraseña" });
  }
};

const getPatients = async (req, res) => {
  try {
    const result = await connectDB.query("SELECT * FROM patients");
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
};
const createPatient = async (req, res) => {
  const { nombre, tipodoc, documento, email, telefono, direccion } = req.body;
  try {
    const [result] = await connectDB.query(
      "INSERT INTO patients(name, document_type_id, document_number, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, tipodoc, documento, email, telefono, direccion]
    );
    res.status(201).json({
      message: "Paciente creado correctamente",
      id: result.insertId,
      nombre,
      tipodoc,
      documento,
      email,
      telefono,
      direccion,
    });
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const result = await connectDB.query("SELECT * FROM appointments");
    res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAppointment = async (req, res) => {
  const {
    patient_id,
    psychologist_id,
    start_time,
    end_time,
    status,
    notes,
    price_cop,
  } = req.body;
  try {
    const [result] = await connectDB.query(
      "INSERT INTO appointments(patient_id, psychologist_id, start_time, end_time, status, notes, price_cop) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        patient_id,
        psychologist_id,
        start_time,
        end_time,
        status,
        notes,
        price_cop,
      ]
    );
    res.status(201).json({
      message: "Appointment created successfully",
      id: result.insertId,
      patient_id,
      psychologist_id,
      start_time,
      end_time,
      status,
      notes,
      price_cop,
    });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAppointment = async (req, res) => {
  const { eventId } = req.params;
  const { start_time, end_time, status, notes, price_cop } = req.body;

  const mysqlStartTime = new Date(start_time)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);
  const mysqlEndTime = new Date(end_time)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  try {
    await connectDB.query(
      "UPDATE appointments SET start_time = ?, end_time = ?, status = ?, notes = ?, price_cop = ? WHERE id = ?",
      [mysqlStartTime, mysqlEndTime, status, notes, price_cop, eventId]
    );
    res.status(200).json({
      message: "Appointment updated successfully",
      start_time: mysqlStartTime,
      end_time: mysqlEndTime,
      status,
      notes,
      price_cop,
    });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAppointment = async (req, res) => {
  const { eventId } = req.params;

  try {
    await connectDB.query("DELETE FROM appointments WHERE id = ?", [eventId]);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAppointmentForm = async (req, res) => {
  const { eventId } = req.params;
  const { start_time, end_time, status, notes, price_cop } = req.body;

  const mysqlStartTime = new Date(start_time)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);
  const mysqlEndTime = new Date(end_time)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  try {
    await connectDB.query(
      "UPDATE appointments SET start_time = ?, end_time = ?, status = ?, notes = ?, price_cop = ? WHERE id = ?",
      [mysqlStartTime, mysqlEndTime, status, notes, price_cop, eventId]
    );
    res.status(200).json({
      message: "Appointment updated successfully",
      start_time: mysqlStartTime,
      end_time: mysqlEndTime,
      status,
      notes,
      price_cop,
    });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener registros médicos
const getMedicalRecords = async (req, res) => {
  try {
    const result = await connectDB.query("SELECT * FROM medical_records");
    res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener los registros médicos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Crear un registro médico
const createMedicalRecord = async (req, res) => {
  const {
    patient_id,
    name,
    gender,
    marital_status,
    medical_history,
    psychological_history,
    treatment_plan,
    observations,
    document_number,
    date_of_birth,
  } = req.body;

  try {
    const [result] = await connectDB.query(
      "INSERT INTO medical_records(patient_id, name, gender, marital_status, medical_history, psychological_history, treatment_plan, observations, document_number, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        patient_id,
        name,
        gender,
        marital_status,
        medical_history,
        psychological_history,
        treatment_plan,
        observations,
        document_number,
        date_of_birth,
      ]
    );
    res.status(201).json({
      message: "Medical record created successfully",
      id: result.insertId,
      patient_id,
      name,
      gender,
      marital_status,
      medical_history,
      psychological_history,
      treatment_plan,
      observations,
      document_number,
      date_of_birth,
    });
  } catch (error) {
    console.error("Error al crear el registro médico:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Actualizar un registro médico
const updateMedicalRecord = async (req, res) => {
  const { recordId } = req.params;
  const {
    patient_id,
    name,
    gender,
    marital_status,
    medical_history,
    psychological_history,
    treatment_plan,
    observations,
    document_number,
    date_of_birth,
  } = req.body;

  try {
    await connectDB.query(
      "UPDATE medical_records SET patient_id = ?, name = ?, gender = ?, marital_status = ?, medical_history = ?, psychological_history = ?, treatment_plan = ?, observations = ?, document_number = ?, date_of_birth = ? WHERE id = ?",
      [
        patient_id,
        name,
        gender,
        marital_status,
        medical_history,
        psychological_history,
        treatment_plan,
        observations,
        document_number,
        date_of_birth,
        recordId,
      ]
    );
    res.status(200).json({
      message: "Medical record updated successfully",
      patient_id,
      name,
      gender,
      marital_status,
      medical_history,
      psychological_history,
      treatment_plan,
      observations,
      document_number,
      date_of_birth,
    });
  } catch (error) {
    console.error("Error al actualizar el registro médico:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  register,
  login,
  profile,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
  confirmAccount,
  getPatients,
  createPatient,
  getAppointments,
  updateAppointment,
  updateAppointmentForm,
  deleteAppointment,
  createAppointment,
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
};
