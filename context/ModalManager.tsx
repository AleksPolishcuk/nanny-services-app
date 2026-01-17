"use client";

import { useModal, isAppointmentModalData } from "@/context/ModalContext";
import AuthModal from "@/components/AuthModal/AuthModal";
import UnauthorizedModal from "@/components/Modal/UnauthorizedModal/UnauthorizedModal";
import AppointmentModal from "@/components/Modal/AppointmentModal/AppointmentModal";
import { useCallback } from "react";

export default function ModalManager() {
  const { currentModal, closeModal, modalData, openModal } = useModal();

  const handleSwitchMode = useCallback(
    (mode: "login" | "register") => {
      openModal(mode);
    },
    [openModal]
  );

  return (
    <>
      <AuthModal
        isOpen={currentModal === "login" || currentModal === "register"}
        mode={currentModal === "register" ? "register" : "login"}
        onClose={closeModal}
        onSwitchMode={handleSwitchMode}
      />

      <UnauthorizedModal
        isOpen={currentModal === "unauthorized"}
        onClose={closeModal}
      />

      {currentModal === "appointment" && isAppointmentModalData(modalData) && (
        <AppointmentModal
          isOpen={true}
          onClose={closeModal}
          nannyName={modalData.nannyName}
          nannyAvatarUrl={modalData.nannyAvatarUrl}
        />
      )}
    </>
  );
}
