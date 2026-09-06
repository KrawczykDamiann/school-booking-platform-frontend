import styles from "./BookingModal.module.scss";
import { Button } from "../../components/ui/Button/Button";
import warningIcon from "../../assets/warning.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input/Input";
import { useInput } from "../../hooks/useInput";
import { validation } from "../../utils/validators";
import type { BookingModalType } from "../../types/BookingModalType";
import { getBookingModalConfig } from "../../utils/getBookingModalConfig";

type BookingModalProps = {
  type: BookingModalType;
  onClose: () => void;
  onResetBooking: () => void;
  bookingUuid?: string;
};

export const BookingModal: React.FC<BookingModalProps> = ({
  type,
  onClose,
  onResetBooking,
  bookingUuid,
}) => {
  const content = getBookingModalConfig(type);
  const navigate = useNavigate();
  const textInput = useInput({ validator: validation.validateText });

  const handleNavigation = () => {
    onClose();
    navigate("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleSubmitConfirmation = () => {
    textInput.setError("");

    const error = validation.validateText(textInput.value);

    if (error) {
      textInput.setError(error);
      return;
    }

    handleNavigation();
  };

  const primaryButtonAction = () => {
    if (type === "confirmationRequested") {
      return handleSubmitConfirmation();
    } else if (type === "somethingWentWrong") {
      console.log("ok");
      return handleRetry();
    } else {
      return handleNavigation();
    }
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <img src={content.icon} alt="Status icon" />
        <h3 className={`${styles.title} ${styles[`title-${type}`]}`}>
          {content.title}
        </h3>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </div>

      <div className={styles.modalBottom}>
        <div className={styles.info}>
          {content.showBookingUuid && (
            <span className={styles.bookingId}>
              Booking id:{" "}
              <span className={styles.bookingIdValue}>{bookingUuid}</span>
            </span>
          )}

          {content.showReasonInput && (
            <Input
              label="Reason"
              type="text"
              placeholder="For example: I requested this time for my 2d kid"
              value={textInput.value}
              onChange={textInput.onChange}
              error={textInput.error}
              onBlur={textInput.onBlur}
              required
            />
          )}
          {content.warningMessage && (
            <div className={styles.warningMessage}>
              <img
                src={warningIcon}
                alt="Warning icon"
                className={styles.infoIcon}
              />
              {content.warningMessage}
            </div>
          )}
        </div>

        <div className={styles.buttonsConainer}>
          <Button
            type="button"
            variant="primary"
            theme={content.buttonTheme}
            onClick={primaryButtonAction}
          >
            {content.primaryButtonText}
          </Button>
          {content.secondaryButtonText && (
            <Button type="button" variant="secondary" onClick={onResetBooking}>
              {content.secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
