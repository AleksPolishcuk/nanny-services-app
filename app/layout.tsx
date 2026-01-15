import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header/Header";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Nanny.Services",
  description: "Nanny services app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <FavoritesProvider>{children}</FavoritesProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
