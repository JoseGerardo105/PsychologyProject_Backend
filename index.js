import express from "express"; // Crearemos nuestro servidor con express
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'

/**
 * La variable app contendrá toda la funcionalidad que requerimos
 * para crear nuestro servidor
 */
const app = express();
dotenv.config(); //Con esta linea escanea el archivo .env

//routes
app.get('/ping',async(req,res) => {
    const result = await connectDB.query('SELECT * from medical_records')
    res.json(result)
});

//settings
app.set('port', process.env.port || 4000 );

app.listen(app.get('port'), () => {
    console.log('Servidor funcionando en puerto',app.get('port'));
}); 

// pendiente
// connectDB();
