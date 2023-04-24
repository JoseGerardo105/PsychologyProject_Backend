import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validar la información del usuario
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      email
    );
    if (result[0].length > 0) {
      res
        .status(409)
        .json({ error: "A psychologist with this email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const [rows] = await connectDB.query(
        "INSERT INTO psychologists(name,email,password) VALUES (?, ?, ?)", [name,email,hashedPassword]
      );
      res.status(201).json({ message: "Psychologist registered successfully", id:rows.insertId, name, email,hashedPassword});
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

  const {email, password} = req.body

  // Validar la información del usuario
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      email
    );

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
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
        res.status(401).json({ error: "Invalid email or password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }

  // res.json({ url: "Ingresando psicólogo" });
};

/*const register = async (req, res) => {
  // Validar la información del usuario
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (req.body.password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      req.body.email
    );
    console.log("Query result:", result[0]);
    if (result[0].length > 0) {
      res
        .status(409)
        .json({ error: "A psychologist with this email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const psychologistData = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      };

      await connectDB.query(
        "INSERT INTO psychologists SET ?",
        psychologistData
      );
      res.status(201).json({ message: "Psychologist registered successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};*/

/*const login = async (req, res) => {
  // Validar la información del usuario
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      req.body.email
    );

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        result[0][0].password
      );

      if (isPasswordValid) {
        const token = jwt.sign({ id: result.id }, "your_jwt_secret", {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
*/

const changePassword = async (req, res) => {
  // Validar la información del usuario
  if (!req.body.email || !req.body.newPassword) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }

  if (req.body.newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "New password must be at least 8 characters long" });
  }

  try {
    // Verificar si existe un psicólogo con el correo electrónico proporcionado
    const result = await connectDB.query(
      "SELECT * FROM psychologists WHERE email = ?",
      req.body.email
    );

    if (result[0].length === 0) {
      res.status(404).json({ error: "Psychologist not found" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      await connectDB.query(
        "UPDATE psychologists SET password = ? WHERE email = ?",
        [hashedPassword, req.body.email]
      );
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { register, login, changePassword, getPsychologists };
