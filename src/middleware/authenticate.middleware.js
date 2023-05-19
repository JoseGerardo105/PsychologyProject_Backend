import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";

const checkUserById = async (id) => {
  const result = await connectDB.query(
    "SELECT id,name,email FROM psychologists WHERE id = ?",
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
      //Comprobar el token y realizar la autenticación
      token = req.headers.authorization.split(" ")[1];
      const decoder = jwt.verify(token, "your_jwt_secret");
      const psychologist = await checkUserById(decoder.id);
      req.body=psychologist;
      return next();
    } catch (error) {
      const e = new Error("Wron token");
      return res.status(403).json({ message: e.message });
    }
  }

  if (!token) {
    const error = new Error("Wron token or without bearer");
    res.status(403).json({ message: error.message });
  }
  next();
  //   res.json();
};

export default authentication;
