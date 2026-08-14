import styles from "./LessonBookingModal.module.scss";
import warningIcon from "../../assets/warning.svg";
import { Button } from "../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import confirmationBookedIcon from "../../assets/confirmation-booked.svg";

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
          <img src={confirmationBookedIcon} alt="Confirmation Booked Icon" />
          <h3 className={styles.title}>Lesson booked</h3>
          <p className={styles.subtitle}>
            Your requested slot was successfully reserved
          </p>
        </div>

        <div className={styles.modalBottom}>
          <div className={styles.info}>
            <span className={styles.bookingId}>
              Booking id:
              {" "}
              <span className={styles.bookingIdValue}>U235bdha6 </span>
            </span>
            <div className={styles.warningMessage}>
              <img
                src={warningIcon}
                alt="Warning icon"
                className={styles.infoIcon}
              />
              We will send a confirmation to your email
            </div>
          </div>

          <div className={styles.buttonsConainer}>
            <Button
              type="button"
              variant="primaryModal"
              onClick={() => navigate("/")}
            >
              Understood
            </Button>
            <Button type="button" variant="secondaryModal" onClick={onResetBooking}>
              Book more lessons
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
