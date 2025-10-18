import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",        // tu usuario
  password: "1234",// tu contraseña
  database: "sistema_nomina",
});
