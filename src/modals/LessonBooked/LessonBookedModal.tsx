import styles from "./LessonBookedModal.module.scss";
import { Button } from "../../components/ui/Button/Button";
import confirmationBookedIcon from "../../assets/confirmation-booked.svg";
import warningIcon from "../../assets/warning.svg";
import { useNavigate } from "react-router-dom";

type LessonBookedModalProps = {
  onClose: () => void;
  onResetBooking: () => void;
  bookingUuid: string;
};

export const LessonBookedModal: React.FC<LessonBookedModalProps> = ({
  onClose,
  onResetBooking,
  bookingUuid,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
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
            Booking id:{" "}
            <span className={styles.bookingIdValue}>{bookingUuid}</span>
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
          <Button type="button" variant="primary" theme="success" onClick={handleNavigation}>
            Understood
          </Button>
          <Button type="button" variant="secondary" onClick={onResetBooking}>
            Book more lessons
          </Button>
        </div>
      </div>
    </>
  );
};
