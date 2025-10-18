"use client";
import { HomeIcon, UsersIcon, ClipboardDocumentListIcon, ChartBarIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-3 flex gap-6 items-center">
      <a href="/" className="inline-flex items-center gap-2 font-medium hover:text-blue-600">
        <HomeIcon className="h-5 w-5" />
        Inicio
      </a>
      <a href="/empleados" className="inline-flex items-center gap-2 hover:text-blue-600">
        <UsersIcon className="h-5 w-5" />
        Empleados
      </a>
      <a href="/nominas" className="inline-flex items-center gap-2 hover:text-blue-600">
        <ClipboardDocumentListIcon className="h-5 w-5" />
        Nóminas
      </a>
      <a href="/reportes" className="inline-flex items-center gap-2 hover:text-blue-600">
        <ChartBarIcon className="h-5 w-5" />
        Reportes
      </a>
    </nav>
  );
}
