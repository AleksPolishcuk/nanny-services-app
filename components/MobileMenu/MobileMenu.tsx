"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  isAuthenticated: boolean;
  displayName: string;
  openLogin: () => void;
  openRegister: () => void;
  onLogout: () => void;
  currentPath: string;
};

export default function MobileMenu({
  isOpen,
  onToggle,
  isAuthenticated,
  displayName,
  openLogin,
  openRegister,
  onLogout,
  currentPath,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleBackdropClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains(styles.menuOverlay)) {
          onToggle();
        }
      };

      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onToggle();
        }
      };

      document.addEventListener("click", handleBackdropClick);
      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.removeEventListener("click", handleBackdropClick);
        document.removeEventListener("keydown", handleEscKey);
      };
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, onToggle]);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath?.startsWith(href);
  };

  return (
    <div className={styles.mobileMenu}>
      <button
        className={`${styles.burger} ${isOpen ? styles.open : ""}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </button>

      <div className={`${styles.menuOverlay} ${isOpen ? styles.show : ""}`}>
        <div className={styles.menuContent}>
          {isAuthenticated && (
            <div className={styles.mobileProfile}>
              <div className={styles.mobileUserIcon}>
                <svg
                  width="20"
                  height="20"
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
              </div>
              <span className={styles.mobileUserName}>{displayName}</span>
            </div>
          )}

          <nav className={styles.mobileNav}>
            <Link
              href="/"
              className={`${styles.mobileNavLink} ${
                isActive("/") ? styles.active : ""
              }`}
              onClick={onToggle}
            >
              Home
            </Link>

            <Link
              href="/nannies"
              className={`${styles.mobileNavLink} ${
                isActive("/nannies") ? styles.active : ""
              }`}
              onClick={onToggle}
            >
              Nannies
            </Link>

            {isAuthenticated && (
              <Link
                href="/favorites"
                className={`${styles.mobileNavLink} ${
                  isActive("/favorites") ? styles.active : ""
                }`}
                onClick={onToggle}
              >
                Favorites
              </Link>
            )}
          </nav>

          <div className={styles.mobileActions}>
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={styles.mobileBtnLogin}
                  onClick={() => {
                    onToggle();
                    openLogin();
                  }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className={styles.mobileBtnRegister}
                  onClick={() => {
                    onToggle();
                    openRegister();
                  }}
                >
                  Registration
                </button>
              </>
            ) : (
              <button
                type="button"
                className={styles.mobileBtnLogout}
                onClick={() => {
                  onToggle();
                  onLogout();
                }}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
