import type { Dispatch, RefObject, SetStateAction } from "react";
import { DropdownIcon } from "../../icons/DropdownIcon";
import styles from "./UserDropdown.module.scss";

type Props = {
  name: string;
  dropdownRef: RefObject<HTMLDivElement | null>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => void;
};

export const UserDropdown: React.FC<Props> = ({
  name,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogout,
}) => {
  return (
    <div
      className={`${styles.dropdownContainer} ${isDropdownOpen ? styles.dropdownContainerOpen : ""}`}
      ref={dropdownRef}
    >
      <button
        className={styles.dropdownTrigger}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className={styles.dropdownText}>{name}</span>
        <DropdownIcon
          size={12}
          className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconActive : ""}`}
        />
      </button>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownArrow} />
          <ul className={styles.dropdownMenuList}>
            <li className={styles.dropdownMenuItem}>Settings</li>
            <li className={styles.dropdownMenuItem}>Help</li>
            <li className={styles.dropdownMenuItem}>
              <button
                className={styles.dropdownMenuButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
