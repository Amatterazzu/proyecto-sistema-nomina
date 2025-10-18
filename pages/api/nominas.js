import { pool } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { mes, año } = req.body;
      await pool.query("CALL CalcularNominaMensual(?, ?)", [mes, año]);
      return res.json({ message: "Nómina generada" });
    }

    if (req.method === "GET") {
      const [rows] = await pool.query(`
        SELECT n.mes, n.año, e.nombre AS empleado, p.nombre AS puesto, n.salario_neto
        FROM Nominas n
        JOIN Empleados e ON n.empleado_id = e.id
        JOIN Puestos p ON e.puesto_id = p.id
        ORDER BY n.año DESC, n.mes DESC
      `);
      return res.json(rows);
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en nóminas" });
  }
}
