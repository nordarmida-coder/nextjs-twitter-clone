"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        
        {}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight 
                     text-transparent bg-clip-text 
                     bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600
                     drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]
                     hover:drop-shadow-[0_0_12px_rgba(56,189,248,1)]
                     hover:scale-105 transition-all duration-500 ease-in-out"
          style={{
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          TwiClone
        </Link>

        <div className="flex items-center gap-4">
          {}
          <Link
            href="/tweet/new"
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white 
                       px-5 py-2 rounded-full font-semibold
                       shadow-[0_0_10px_rgba(59,130,246,0.6)]
                       hover:shadow-[0_0_18px_rgba(59,130,246,0.9)]
                       hover:scale-105 transition-all duration-300"
          >
        New Tweet
          </Link>

          {}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                       hover:bg-gray-200 dark:hover:bg-gray-700 
                       transition-all duration-300 shadow-sm"
            title="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}