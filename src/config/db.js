import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = {
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  port: Math.floor(process.env.PORT_DB),
  database: process.env.NAME_DB,
};

export const connectDB = createPool(connection);

export default connectDB;
