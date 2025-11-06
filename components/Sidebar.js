"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: <Home size={22} /> },
    { name: "Search", href: "/search", icon: <Search size={22} /> },
  ];

  return (
    <aside
      className="hidden md:flex flex-col justify-between 
                 fixed left-0 top-0 h-full w-56 
                 border-r border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-950 
                 px-4 py-6 shadow-lg"
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text 
                     bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600
                     drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]
                     hover:drop-shadow-[0_0_10px_rgba(56,189,248,1)]
                     transition-all duration-300 text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          TwiClone
        </Link>

        <nav className="flex flex-col gap-3 mt-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-full 
                         text-gray-700 dark:text-gray-300 font-medium 
                         hover:bg-sky-100 dark:hover:bg-gray-800 transition-all 
                         ${
                           pathname === link.href
                             ? "bg-sky-100 dark:bg-gray-800 text-sky-600 dark:text-sky-400 font-semibold"
                             : ""
                         }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
        © 2025 TwiClone
      </p>
    </aside>
  );
}