"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal/AuthModal";
import MobileMenu from "@/components/MobileMenu/MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);

  const isHome = pathname === "/";

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    return user?.displayName || user?.email || "User";
  }, [user]);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname?.startsWith(href);
  };

  const onLogout = async () => {
    await logout();
    router.push("/");
  };

  const headerClass = isHome ? styles.headerHome : styles.headerInner;

  const navClass = isAuthenticated ? styles.navWithUser : "";

  return (
    <>
      <header className={`${styles.header} ${headerClass}`}>
        <div className={styles.container}>
          {/* Лого */}
          <Link href="/" aria-label="Nanny.Services" className={styles.logo}>
            <Image
              src="/Logo.svg"
              alt="Nanny.Services"
              width={120}
              height={48}
              priority
            />
          </Link>

          {/* Десктопна навігація (показується тільки на 1024px+) */}
          <nav className={`${styles.nav} ${navClass}`}>
            <Link
              href="/"
              className={`${styles.navLink} ${
                isActive("/") ? styles.active : ""
              }`}
            >
              Home
            </Link>

            <Link
              href="/nannies"
              className={`${styles.navLink} ${
                isActive("/nannies") ? styles.active : ""
              }`}
            >
              Nannies
            </Link>

            {isAuthenticated && (
              <Link
                href="/favorites"
                className={`${styles.navLink} ${
                  isActive("/favorites") ? styles.active : ""
                }`}
              >
                Favorites
              </Link>
            )}
          </nav>

          {/* Десктопні дії (показується тільки на 768px+) */}
          <div className={styles.actions}>
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={styles.btnLogin}
                  onClick={openLogin}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className={styles.btnRegister}
                  onClick={openRegister}
                >
                  Registration
                </button>
              </>
            ) : (
              <>
                <div className={styles.userBox}>
                  <span className={styles.userIcon} aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                        fill="currentColor"
                      />
                      <path
                        d="M4 20a8 8 0 0 1 16 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <span className={styles.userName} title={displayName}>
                    {displayName}
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.btnLogout}
                  onClick={onLogout}
                >
                  Log out
                </button>
              </>
            )}
          </div>

          {/* Мобільне меню (показується тільки до 767px) */}
          <MobileMenu
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            isAuthenticated={isAuthenticated}
            displayName={displayName}
            openLogin={openLogin}
            openRegister={openRegister}
            onLogout={onLogout}
            currentPath={pathname}
          />
        </div>
      </header>

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
      />
    </>
  );
}
