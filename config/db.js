import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); //Con esta linea escanea el archivo .env


const connection = {
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  port: Math.floor(process.env.PORT_DB),
  database: process.env.NAME_DB
};
console.log(connection);

export const connectDB = createPool(connection);




// async function connectDB(){
//   try {
//     const poolConfig = {
//       host: process.env.HOST_DB,
//       user: process.env.USER_DB,
//       password: process.env.PASSWORD_DB,
//       port: Math.floor(process.env.PORT_DB),
//       database: process.env.NAME_DB,
//     };

//     const dbConnection = createPool(poolConfig);
//     const connectionAddress = `${poolConfig.host}: ${poolConfig.port}`;
//     console.log(`Conexión realizada en ${connectionAddress}`);


//     const query = async (sql, values) => {
//       const connection = await dbConnection.getConnection();
//       try {
//         const [rows] = await connection.query(sql, values);
//         return rows;
//       } finally {
//         connection.release();
//       }
//     };

//     return { query };

    
//   } catch (error) {
//     console.log(`Error en la conexión con la base de datos `);
//     process.exit(1);
//   }
// };

// export default connectDB;




// const connectDB = async () => {
//   try {
//     const poolConfig = {
//       host: process.env.HOST_DB,
//       user: process.env.USER_DB,
//       password: process.env.PASSWORD_DB,
//       port: Math.floor(process.env.PORT_DB),
//       database: process.env.NAME_DB,
//     };

//     const dbConnection = createPool(poolConfig);
//     const connectionAddress = `${poolConfig.host}: ${poolConfig.port}`;
//     console.log(`Conexión realizada en ${connectionAddress}`);
//   } catch (error) {
//     console.log(`Error ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
