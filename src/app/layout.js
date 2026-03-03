import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "HireHub — Track Your Job Applications",
  description:
    "A modern job application tracker with Kanban pipeline, analytics, and interview management. Stay organized in your job search.",
  keywords: ["job tracker", "application tracker", "kanban", "job search", "career"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
