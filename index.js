/**
 * Crearemos nuestro servidor con express es por ello que es necesario
 * importar el módulo de express
 */
import express from "express";

/**
 * La variable app contendrá toda la funcionalidad que requerimos
 * para crear nuestro servidor
 */
const app = express();

/**
 * use() Es una forma en la que express maneja el routing
 * req: Lo que enviamos
 * res: La respuesta que se obtiene del servidor
 */
app.use('/', (req,res) => {
    res.send('Hola mundo');
});

app.listen(4000, () => {
    console.log('Servidor funcionando en puerto 4000');
});