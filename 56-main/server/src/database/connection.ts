import mysql, {PoolOptions, Pool} from "mysql2/promise";
// @ts-ignore
import dotenv from "dotenv";

dotenv.config();

const access: PoolOptions = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection: Pool = mysql.createPool(access);

export default connection;