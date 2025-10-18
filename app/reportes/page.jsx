"use client";
import { useEffect, useState } from "react";
import { ArrowDownTrayIcon, FunnelIcon } from "@heroicons/react/24/solid";

export default function ReportesPage() {
  const [reportes, setReportes] = useState({});
  const [años, setAños] = useState([]);
  const [meses, setMeses] = useState([]);
  const [año, setAño] = useState("");
  const [mes, setMes] = useState("");

  // Cargar filtros dinámicos
  useEffect(() => {
    fetch("/api/filtros")
      .then(r => r.json())
      .then(data => {
        setAños(data.años);
        setMeses(data.meses);
      });
  }, []);

  // Cargar reportes según filtros
  const cargarReportes = async () => {
    const params = new URLSearchParams();
    if (año) params.append("año", año);
    if (mes) params.append("mes", mes);

    const data = await fetch(`/api/reportes?${params.toString()}`).then(r => r.json());
    setReportes(data);
  };

  useEffect(() => {
    cargarReportes();
  }, [año, mes]);

  // Exportar CSV
  const exportarCSV = () => {
    let csv = "Puesto,Mes,Año,Salarios Base,Bonificaciones,Costo Patronal,Total Pagado\n";
    Object.entries(reportes).forEach(([puesto, datos]) => {
      datos.forEach(d => {
        csv += `${puesto},${d.mes},${d.año},${d.salarios_base},${d.bonificaciones},${d.costo_patronal},${d.total_pagado}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_nomina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reporte por Puesto</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="inline-flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <select
            className="border rounded px-3 py-2"
            value={año}
            onChange={e => setAño(e.target.value)}
          >
            <option value="">Todos los años</option>
            {años.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <select
          className="border rounded px-3 py-2"
          value={mes}
          onChange={e => setMes(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {meses.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button
          onClick={exportarCSV}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Exportar CSV
        </button>
      </div>

      {/* Tablas */}
      {Object.keys(reportes).length === 0 ? (
        <p className="text-gray-500">No hay datos aún</p>
      ) : (
        Object.entries(reportes).map(([puesto, datos]) => (
          <div key={puesto} className="space-y-2">
            <h2 className="text-xl font-semibold text-purple-700">{puesto}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-purple-100 text-purple-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Mes</th>
                    <th className="px-4 py-2 text-left">Año</th>
                    <th className="px-4 py-2 text-left">Salarios Base</th>
                    <th className="px-4 py-2 text-left">Bonificaciones</th>
                    <th className="px-4 py-2 text-left">Costo Patronal</th>
                    <th className="px-4 py-2 text-left">Total Pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(datos) && datos.map((d, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{d.mes}</td>
                      <td className="px-4 py-2">{d.año}</td>
                      <td className="px-4 py-2">Q{d.salarios_base}</td>
                      <td className="px-4 py-2">Q{d.bonificaciones}</td>
                      <td className="px-4 py-2">Q{d.costo_patronal}</td>
                      <td className="px-4 py-2">
                        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                          Q{d.total_pagado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
