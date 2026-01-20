"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import MobileMenu from "../MobileMenu/MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { openModal } = useModal();

  const isAuthenticated = Boolean(user);
  const isHome = pathname === "/";

  const displayName = useMemo(() => {
    return user?.displayName || user?.email || "User";
  }, [user]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const onLogout = async () => {
    await logout();
    router.push("/");
  };

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={[
        styles.header,
        isHome ? styles.headerHome : styles.headerInner,
      ].join(" ")}
    >
      <div className={styles.inner}>
        <Link href="/" aria-label="Nanny.Services">
          <Image
            className={styles.logo}
            src="/Logo.svg"
            alt="Nanny.Services"
            width={120}
            height={48}
          />
        </Link>

        <nav
          className={[
            styles.nav,
            isAuthenticated ? styles.navCenter : styles.navRight,
          ].join(" ")}
        >
          <Link
            href="/"
            className={[
              styles.navLink,
              isActive("/") ? styles.active : "",
            ].join(" ")}
          >
            Home
          </Link>

          <Link
            href="/nannies"
            className={[
              styles.navLink,
              isActive("/nannies") ? styles.active : "",
            ].join(" ")}
          >
            Nannies
          </Link>

          {isAuthenticated && (
            <Link
              href="/favorites"
              className={[
                styles.navLink,
                isActive("/favorites") ? styles.active : "",
              ].join(" ")}
            >
              Favorites
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                className={styles.btnLogin}
                onClick={() => openModal("login")}
              >
                Log In
              </button>
              <button
                type="button"
                className={styles.btnRegister}
                onClick={() => openModal("register")}
              >
                Registration
              </button>
            </>
          ) : (
            <>
              <div className={styles.userBox}>
                <span className={styles.userIcon} aria-hidden="true">
                  <svg width="36" height="36">
                    <use href="/sprite.svg#icon-image" />
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
        <MobileMenu
          isOpen={isOpen}
          onToggle={onToggle}
          isAuthenticated={isAuthenticated}
          displayName={displayName}
          openLogin={() => openModal("login")}
          openRegister={() => openModal("register")}
          onLogout={onLogout}
          currentPath={pathname || "/"}
        />
      </div>
    </header>
  );
}
