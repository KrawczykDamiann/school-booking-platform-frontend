import styles from "./Modal.module.scss";
import type { ModalState } from "../../../context/ModalContext";
import { LoginModal } from "../../../modals/Login/LoginModal";
import { LessonBookedModal } from "../../../modals/LessonBooked/LessonBookedModal";
import { useEffect } from "react";

type ModalProps = {
  modal: ModalState;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
  useEffect(() => {
    if (!modal) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal, onClose]);

  if (!modal) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {modal?.type === "login" && <LoginModal onClose={onClose} />}
        {modal.type === "lessonBooked" && (
          <LessonBookedModal
            onClose={onClose}
            onResetBooking={modal.data.onResetBooking}
            bookingUuid={modal.data.bookingUuid}
          />
        )}
      </div>
    </div>
  );
};
