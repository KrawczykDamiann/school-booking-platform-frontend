import { createContext, useMemo, useState } from "react";
import { Modal } from "../components/ui/Modal/Modal";

export type ModalType = "login" | "lessonBooked";

export type ModalState =
  | {
      type: "login";
    }
  | {
      type: "lessonBooked";
      data: {
        onResetBooking: () => void;
        bookingUuid: string;
      };
    }
  | null;

type ModalContextType = {
  modal: ModalState | null;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextType>({
  modal: null,
  openModal: () => {},
  closeModal: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = (modal: ModalState) => {
    setModal(modal);
  };

  const closeModal = () => {
    setModal(null);
  };

  const value = useMemo(
    () => ({
      modal,
      openModal,
      closeModal,
    }),
    [modal],
  );

  return (
    <ModalContext.Provider value={value}>
      {children} <Modal modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
};
