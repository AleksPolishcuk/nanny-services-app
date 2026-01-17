import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import Header from "@/components/Header/Header";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Footer from "@/components/Footer/Footer";
import ModalManager from "@/context/ModalManager";

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
          <ModalProvider>
            <FavoritesProvider>
              <Header />
              {children}
              <Footer />
              <ModalManager />
            </FavoritesProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
