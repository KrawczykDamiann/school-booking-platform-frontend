import styles from "./ExpiredLinkModal.module.scss";
import warningIcon from "../../assets/warning-circle.svg";
import { Button } from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { useTranslation } from "react-i18next";

export const ExpiredLinkModal: React.FC = () => {
  const navigate = useNavigate();
  const { closeModal } = useContext(ModalContext);
  const { t } = useTranslation();

  const handleClick = () => {
    closeModal();
    navigate("/login");
  };
  return (
    <div className={styles.warningWrapper}>
      <img src={warningIcon} alt="Warning icon" className={styles.icon} />
      <h3 className={styles.title}>{t("expiredLinkModal.title")}</h3>
      <p className={styles.text}>{t("expiredLinkModal.text")}</p>
      <Button variant="primary" theme="warning" onClick={handleClick}>
        Ok
      </Button>
    </div>
  );
};
