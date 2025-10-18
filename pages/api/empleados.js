import { pool } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const [rows] = await pool.query("CALL SeleccionarEmpleados()");
      return res.json(rows[0]); // MySQL devuelve arrays anidados
    }

    if (req.method === "POST") {
      const { nombre, puesto_id } = req.body;
      await pool.query("CALL InsertarEmpleado(?, ?)", [nombre, puesto_id]);
      return res.json({ message: "Empleado agregado" });
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en empleados" });
  }
}
