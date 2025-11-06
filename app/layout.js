import "./globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-poppins" });

export const metadata = {
  title: "Twitter Clone",
  description: "Next.js + Tailwind + File API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${poppins.variable} font-sans 
          min-h-screen bg-gray-50 dark:bg-[#050A1A] 
          text-gray-900 dark:text-[#a8c8ff] 
          transition-colors duration-500
        `}
      >
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:ml-56 max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}