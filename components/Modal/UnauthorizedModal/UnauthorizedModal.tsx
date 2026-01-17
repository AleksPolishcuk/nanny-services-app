"use client";

import Modal from "@/components/Modal/Modal";
import styles from "./UnauthorizedModal.module.css";
import { useModal } from "@/context/ModalContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UnauthorizedModal({ isOpen, onClose }: Props) {
  const { openModal } = useModal();

  const handleLoginClick = () => {
    onClose();
    openModal("login");
  };

  const handleRegisterClick = () => {
    onClose();
    openModal("register");
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
          >
            Log In
          </button>

          <button
            type="button"
            className={styles.btnRegister}
            onClick={handleRegisterClick}
          >
            Registration
          </button>
        </div>
      </div>
    </Modal>
  );
}
