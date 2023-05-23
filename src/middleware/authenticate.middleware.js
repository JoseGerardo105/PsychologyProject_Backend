import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const checkUserById = async (id) => {
  const result = await connectDB.query(
    "SELECT id, name, email, password FROM psychologists WHERE id = ?",
    id
  );

  return result[0][0];
};

const authentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Comprobar el token y realizar la autenticación
      token = req.headers.authorization.split(" ")[1];
      const decoder = jwt.verify(token, "your_jwt_secret");
      const psychologist = await checkUserById(decoder.id);

      // Asignar roles basados en las credenciales quemadas
      psychologist.role =
        psychologist.email === process.env.VITE_ADMIN_EMAIL &&
        psychologist.password === process.env.VITE_ADMIN_PASSWORD
          ? "administrador"
          : "usuario";
      req.user = psychologist;

      return next();
    } catch (error) {
      const e = new Error("Token incorrecto");
      return res.status(403).json({ message: e.message });
    }
  }

  if (!token) {
    const error = new Error("Token incorrecto o sin Bearer");
    res.status(403).json({ message: error.message });
  }
  next();
};

export default authentication;
