import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
import generateToken from "../helpers/generateToken.js";

const checkUserByEmail = async (email) => {
  const result = await connectDB.query(
    "SELECT * FROM psychologists WHERE email = ?",
    email
  );
  return result[0];
};

const checkUserByToken = async (token) => {
  const result = await connectDB.query(
    "SELECT * FROM psychologists WHERE new_password_token = ?",
    [token]
  );

  return result[0];
};

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
    const result =  await checkUserByEmail(email);

    if (result.length > 0) {
      res
        .status(409)
        .json({ error: "A psychologist with this email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const [rows] = await connectDB.query(
        "INSERT INTO psychologists(name,email,password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      res.status(201).json({
        message: "Psychologist registered successfully",
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
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const result = await checkUserByEmail(email);
    if (result.length === 0) {
      res.status(401).json({ error: "The account entered does not exist" });
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        result[0].password
      );

      if (isPasswordValid) {
        const token = jwt.sign({ id: result.id }, "your_jwt_secret", {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email,  } = req.body;
  const name = null;
  const password = null;
  //Verificar la existencia de un usuario con determinado email
  try {
    const result = await checkUserByEmail(email);

    if (result.length === 0) {
      const error = new Error("El usuario no existe");
      res.status(404).json({ msg: error.message });
    } else {
      //Si el usuario existe generamos un Token que se envía al correo
      const token = generateToken();

      const [result] = await connectDB.query(
        "UPDATE psychologists SET name = IFNULL(?,name), password=IFNULL(?,password), new_password_token = ? WHERE email = ?",
        [name, password, token, email]
      );

      const [rows] = await connectDB.query(
        "SELECT * FROM psychologists WHERE email = ?",
        [email]
      );
      res.status(200).json({msg:"Validation email has been sent",user:rows[0]});
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const result = await checkUserByToken(token);
  if (result.length === 0) {
    const error = new Error("Token no válido");
    res.status(400).json({ message: error.message });
  } else {
    res.json({ msg: "Token válido y el usuario existe" });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const newToken = null;
  const { password } = req.body;

  //Comprobar el token
  const result = await checkUserByToken(token);
  if (result.length === 0) {
    const error = new Error("Invalid Token");
    return res.status(400).json({ message: error.message });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectDB.query(
      "UPDATE psychologists SET new_password_token = ?, password = ? WHERE new_password_token = ?",
      [newToken, hashedPassword, token]
    );
    res.json({ message: "Password has been changed" });
  } catch (error) {
    res.json(error.message);
  }
};

export {
  register,
  login,
  forgetPassword,
  checkToken,
  newPassword,
  getPsychologists,
};
