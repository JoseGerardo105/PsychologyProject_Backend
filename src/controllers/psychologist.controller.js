import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validar la información del usuario
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Formato de correo electrónico no válido" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      email
    );
    if (result[0].length > 0) {
      res
        .status(409)
        .json({ error: "Ya existe un psicólogo con este correo electrónico" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const [rows] = await connectDB.query(
        "INSERT INTO psychologists(name,email,password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      res.status(201).json({
        message: "Psicólogo registrado con éxito",
        id: rows.insertId,
        name,
        email,
        hashedPassword,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
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
    return res
      .status(400)
      .json({ error: "Correo electrónico y contraseña obligatorios" });
  }
  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      email
    );

    if (result.length === 0) {
      res
        .status(401)
        .json({ error: "Correo electrónico o contraseña no válidos" });
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        result[0][0].password
      );

      if (isPasswordValid) {
        const token = jwt.sign({ id: result.id }, "your_jwt_secret", {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res
          .status(401)
          .json({ error: "Correo electrónico o contraseña no válidos" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  // Validar la información del usuario
  if (!req.body.email || !req.body.newPassword) {
    return res
      .status(400)
      .json({ error: "Se requiere correo electrónico y nueva contraseña" });
  }

  if (req.body.newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "La nueva contraseña debe tener al menos 8 caracteres" });
  }

  try {
    // Verificar si existe un psicólogo con el correo electrónico proporcionado
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      req.body.email
    );

    if (result[0].length === 0) {
      res.status(404).json({ error: "Psicólogo no encontrado" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      await connectDB.query(
        "UPDATE psychologists SET password = ? WHERE email = ?",
        [hashedPassword, req.body.email]
      );
      res.status(200).json({ message: "Contraseña modificada correctamente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { register, login, changePassword, getPsychologists };
