"use client";
import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState(1);

  useEffect(() => {
    fetch("/api/empleados").then(r => r.json()).then(setEmpleados);
  }, []);

  const agregar = async () => {
    if (!nombre) return;
    await fetch("/api/empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, puesto_id: puesto }),
    });
    const data = await fetch("/api/empleados").then(r => r.json());
    setEmpleados(data);
    setNombre("");
    setPuesto(1);
  };

  const eliminar = async (id) => {
    await fetch(`/api/empleados/${id}`, { method: "DELETE" });
    const data = await fetch("/api/empleados").then(r => r.json());
    setEmpleados(data);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Empleados</h1>

      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Nuevo Empleado</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={puesto}
            onChange={e => setPuesto(parseInt(e.target.value))}
          >
            <option value={1}>Gerente</option>
            <option value={2}>Jefe</option>
            <option value={3}>Vendedor</option>
          </select>
          <button
            onClick={agregar}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-6 w-6" />
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Empleados</h2>
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Puesto</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map(e => (
              <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{e.id}</td>
                <td className="px-4 py-2">{e.nombre}</td>
                <td className="px-4 py-2">{e.puesto}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => eliminar(e.id)}
                    className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {empleados.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No hay empleados registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
