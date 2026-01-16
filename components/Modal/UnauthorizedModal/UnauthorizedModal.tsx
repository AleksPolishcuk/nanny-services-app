"use client";

import Modal from "@/components/Modal/Modal";
import styles from "./UnauthorizedModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
};

export default function UnauthorizedModal({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
}: Props) {
  const handleLoginClick = () => {
    onClose();
    onOpenLogin?.();
  };

  const handleRegisterClick = () => {
    onClose();
    onOpenRegister?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Authorization required">
      <div className={styles.wrap}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="32" height="32" aria-hidden="true">
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>

        <div className={styles.iconContainer}>
          <svg
            width="64"
            height="64"
            aria-hidden="true"
            className={styles.icon}
          >
            <use href="/sprite.svg#icon-Property-heart1Default" />
          </svg>
        </div>

        <h2 className={styles.title}>Authorization Required</h2>

        <p className={styles.description}>
          This feature is available only for authorized users. Please log in or
          register to add nannies to your favorites.
        </p>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.btnLogin}
            onClick={handleLoginClick}
            disabled={!onOpenLogin}
          >
            Log In
          </button>

          <button
            type="button"
            className={styles.btnRegister}
            onClick={handleRegisterClick}
            disabled={!onOpenRegister}
          >
            Registration
          </button>
        </div>
      </div>
    </Modal>
  );
}
