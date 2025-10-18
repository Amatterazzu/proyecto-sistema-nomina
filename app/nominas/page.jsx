"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function NominasPage() {
  const [nominas, setNominas] = useState([]);
  const [mes, setMes] = useState("");
  const [año, setAño] = useState("");

  const cargarNominas = async () => {
    const data = await fetch("/api/nominas").then(r => r.json());
    setNominas(data);
  };

  useEffect(() => {
    cargarNominas();
  }, []);

  const generarNomina = async () => {
    if (!mes || !año) return;
    await fetch("/api/nominas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mes, año }),
    });
    await cargarNominas();
    setMes("");
    setAño("");
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Nóminas</h1>

      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Generar Nómina Mensual</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Mes"
            value={mes}
            onChange={e => setMes(e.target.value)}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Año"
            value={año}
            onChange={e => setAño(e.target.value)}
          />
          <button
            onClick={generarNomina}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <PlusIcon className="h-5 w-5" />
            Generar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Nóminas</h2>
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="px-4 py-2 text-left">Empleado</th>
              <th className="px-4 py-2 text-left">Puesto</th>
              <th className="px-4 py-2 text-left">Mes</th>
              <th className="px-4 py-2 text-left">Año</th>
              <th className="px-4 py-2 text-left">Salario Neto</th>
            </tr>
          </thead>
          <tbody>
            {nominas.map((n, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{n.empleado}</td>
                <td className="px-4 py-2">{n.puesto}</td>
                <td className="px-4 py-2">{n.mes}</td>
                <td className="px-4 py-2">{n.año}</td>
                <td className="px-4 py-2">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    Q{n.salario_neto}
                  </span>
                </td>
              </tr>
            ))}
            {nominas.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No hay nóminas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
