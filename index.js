import express from "express"; // Crearemos nuestro servidor con express
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

/**
 * La variable app contendrá toda la funcionalidad que requerimos
 * para crear nuestro servidor
 */
const app = express();
app.use(express.json());
dotenv.config(); //Con esta linea escanea el archivo .env

// importar rutas
import authRoutes from "./routes/authRoutes.js";
app.use("/api", authRoutes);

//prueba base de datos
app.get("/ping", async (req, res) => {
  const result = await connectDB.query("SELECT * from medical_records");
  res.json(result[0]);
});

//settings
app.set("port", process.env.port || 4000);

app.listen(app.get("port"), () => {
  console.log("Servidor funcionando en puerto", app.get("port"));
});

// pendiente
// connectDB();
