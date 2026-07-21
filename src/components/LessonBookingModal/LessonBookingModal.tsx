import styles from "./LessonBookingModal.module.scss";
import warningIcon from "../../assets/warning.svg";
import { Button } from "../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface LessonBookingModalProps {
  onClose: () => void;
  onResetBooking: () => void;
}

export const LessonBookingModal: React.FC<LessonBookingModalProps> = ({
  onClose,
  onResetBooking,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Lesson booked</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <p className={styles.subtitle}>
          You requested slot was successfully reserved
        </p>

        <span className={styles.bookingId}>
          Booking id: <span className={styles.bookingIdValue}>U235bdha6 </span>
        </span>

        <div className={styles.warningMessage}>
          <img
            src={warningIcon}
            alt="Warning icon"
            className={styles.infoIcon}
          />
          We will send you a magic link to confirm your email
        </div>

        <div className={styles.buttonsConainer}>
          <Button type="button" variant="primary" onClick={() => navigate("/")}>
            Understood
          </Button>
          <Button type="button" variant="secondary" onClick={onResetBooking}>
            Book more lessons
          </Button>
        </div>
      </div>
    </div>
  );
};
