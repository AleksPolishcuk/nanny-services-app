import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import Header from "@/components/Header/Header";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Footer from "@/components/Footer/Footer";
import ModalManager from "@/context/ModalManager";
import { ToastProvider } from "@/components/Toast/ToastProvider";

export const metadata: Metadata = {
  title: "Nanny.Services",
  description: "Nanny services app",
  icons: {
    icon: [
      {
        url: "/public/Icon.svg",
      },
    ],
  },
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
              <ToastProvider>
                <Header />
                {children}
                <Footer />
                <ModalManager />
              </ToastProvider>
            </FavoritesProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
