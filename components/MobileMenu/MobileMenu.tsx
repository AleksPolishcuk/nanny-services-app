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
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle();
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onToggle]);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath?.startsWith(href);
  };

  return (
    <div className={styles.mobileMenu}>
      <button
        type="button"
        className={`${styles.burger} ${isOpen ? styles.open : ""}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      <div
        className={`${styles.menuOverlay} ${isOpen ? styles.show : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) onToggle();
        }}
      >
        <div className={styles.menuContent}>
          {isAuthenticated && (
            <div className={styles.mobileProfile}>
              <div className={styles.mobileUserIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              <span className={styles.mobileUserName} title={displayName}>
                {displayName}
              </span>
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
