import express from "express"; // Crearemos nuestro servidor con express
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

/**
 * La variable app contendrá toda la funcionalidad que requerimos
 * para crear nuestro servidor
 */
const app = express();
app.use(express.json());


//Escanea el archivo .env
dotenv.config(); 


// importar rutas
app.use("/api/psychologists", authRoutes);


//settings
app.set("port", process.env.port || 4000);

app.listen(app.get("port"), () => {
  console.log("Server running on port ", app.get("port"));
});


