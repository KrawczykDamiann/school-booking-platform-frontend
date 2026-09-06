import type { BookingModalType } from "../types/BookingModalType";
import confirmationBookedIcon from "../assets/confirmation-booked.svg";
import infoCircleIcon from "../assets/info-circle.svg";
import warningCircleIcon from "../assets/warning-circle.svg";
import type { ButtonTheme } from "../components/ui/Button/Button";

type BookingModalConfiguration = {
  icon: string;
  title: string;
  subtitle: string;
  warningMessage?: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  buttonTheme: ButtonTheme;
  showBookingUuid: boolean;
  showReasonInput: boolean;
};

export function getBookingModalConfig(type: BookingModalType): BookingModalConfiguration {
  switch (type) {
    case "lessonBooked":
      return {
        icon: confirmationBookedIcon,
        title: "Lesson booked",
        subtitle: "You requested slot was successfully reserved",
        warningMessage: "We will send a confirmation to your email",
        primaryButtonText: "Understood",
        secondaryButtonText: "Book more lessons",
        buttonTheme: "success",
        showBookingUuid: true,
        showReasonInput: false,
      };
    case "lessonRequested":
      return {
        icon: infoCircleIcon,
        title: "Lesson requested",
        subtitle: "You requested was successfully sent to administrator",
        warningMessage:
          "We will send you a confirmation as soon as your request is approved",
        primaryButtonText: "Understood",
        secondaryButtonText: "Book more lessons",
        buttonTheme: "info",
        showBookingUuid: true,
        showReasonInput: false,
      };
    case "confirmationRequested":
      return {
        icon: warningCircleIcon,
        title: "Time already booked",
        subtitle:
          "There already exists a booking at this time associated with the email you provided",
        warningMessage:
          "We will send you a confirmation as soon as your request is approved",
        primaryButtonText: "Send request",
        secondaryButtonText: "Chose another slot",
        buttonTheme: "warning",
        showBookingUuid: false,
        showReasonInput: true,
      };
    case "somethingWentWrong":
      return {
        icon: warningCircleIcon,
        title: "Something went wrong",
        subtitle:
          "We’re having trouble processing your request. Please try refreshing the page or try again in a few moments.",
        primaryButtonText: "Try again",
        buttonTheme: "warning",
        showBookingUuid: false,
        showReasonInput: false,
      };
  }
}
