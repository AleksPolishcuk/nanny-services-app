"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type ModalType =
  | "login"
  | "register"
  | "unauthorized"
  | "appointment"
  | null;

export interface AppointmentModalData {
  nannyName: string;
  nannyAvatarUrl: string;
}

export type ModalData = AppointmentModalData | undefined;

export interface ModalContextType {
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  currentModal: ModalType;
  modalData: ModalData;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function isAppointmentModalData(
  data: ModalData
): data is AppointmentModalData {
  return (
    data !== undefined &&
    typeof data.nannyName === "string" &&
    typeof data.nannyAvatarUrl === "string"
  );
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>(undefined);

  const openModal = useCallback((type: ModalType, data?: ModalData) => {
    setCurrentModal(type);
    if (data) {
      setModalData(data);
    } else {
      setModalData(undefined);
    }
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setModalData(undefined);
  }, []);

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, currentModal, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
