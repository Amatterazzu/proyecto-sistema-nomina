import { pool } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const [años] = await pool.query("SELECT DISTINCT año FROM Nominas ORDER BY año DESC");
      const [meses] = await pool.query("SELECT DISTINCT mes FROM Nominas ORDER BY mes ASC");

      return res.json({
        años: años.map(r => r.año),
        meses: meses.map(r => r.mes),
      });
    }
    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando filtros" });
  }
}
