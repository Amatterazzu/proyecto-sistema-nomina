import { pool } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { año, mes } = req.query;

      let query = `
        SELECT p.nombre AS puesto, n.mes, n.año,
               SUM(n.salario_base) AS salarios_base,
               SUM(n.bonificacion) AS bonificaciones,
               SUM(n.igss_patronal) AS costo_patronal,
               SUM(n.salario_base + n.bonificacion - n.igss_laboral - n.isr) AS total_pagado
        FROM Nominas n
        JOIN Empleados e ON n.empleado_id = e.id
        JOIN Puestos p ON e.puesto_id = p.id
        WHERE 1=1
      `;
      const params = [];
      if (año) { query += " AND n.año = ?"; params.push(año); }
      if (mes) { query += " AND n.mes = ?"; params.push(mes); }
      query += " GROUP BY p.nombre, n.año, n.mes ORDER BY n.año, n.mes, p.nombre";

      const [rows] = await pool.query(query, params);

      // Agrupar por puesto
      const reporte = {};
      rows.forEach((row) => {
        if (!reporte[row.puesto]) reporte[row.puesto] = [];
        reporte[row.puesto].push({
          mes: row.mes,
          año: row.año,
          salarios_base: row.salarios_base,
          bonificaciones: row.bonificaciones,
          costo_patronal: row.costo_patronal,
          total_pagado: row.total_pagado,
        });
      });

      return res.json(reporte);
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en reportes" });
  }
}
