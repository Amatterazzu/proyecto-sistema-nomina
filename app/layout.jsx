import Navbar from "../componentes/NavBar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
