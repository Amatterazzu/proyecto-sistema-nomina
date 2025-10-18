"use client";
import { HomeIcon, UsersIcon, ClipboardDocumentListIcon, ChartBarIcon } from "@heroicons/react/20/solid";

export default function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Sistema de Nómina</h1>
      <p className="text-gray-600">Bienvenido al sistema de gestión de empleados, nóminas y reportes.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Empleados */}
        <a
          href="/empleados"
          className="bg-white shadow rounded-lg p-6 flex flex-col items-center hover:shadow-md transition"
        >
          <UsersIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Empleados</h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Administra la información de los empleados.
          </p>
        </a>

        {/* Nóminas */}
        <a
          href="/nominas"
          className="bg-white shadow rounded-lg p-6 flex flex-col items-center hover:shadow-md transition"
        >
          <ClipboardDocumentListIcon className="h-8 w-8 text-green-600 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Nóminas</h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Genera y consulta las nóminas de pago.
          </p>
        </a>

        {/* Reportes */}
        <a
          href="/reportes"
          className="bg-white shadow rounded-lg p-6 flex flex-col items-center hover:shadow-md transition"
        >
          <ChartBarIcon className="h-8 w-8 text-purple-600 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Reportes</h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Visualiza reportes detallados por puesto y período.
          </p>
        </a>
      </div>

      {/* Botón destacado */}
      <div className="flex justify-center">
        <a
          href="/empleados"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <HomeIcon className="h-5 w-5" />
          Ir a Empleados
        </a>
      </div>
    </div>
  );
}
