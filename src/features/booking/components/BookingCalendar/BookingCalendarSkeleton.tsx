import { Skeleton } from "../../../../components/ui/Skeleton/Skeleton";
import styles from "./BookingCalendar.module.scss";

type BookingCalendarSkeletonProps = {
  type: "subjectSelection" | "calendar";
};

const SKELETON_DAYS_COUNT = 6;
const DAILY_SLOTS_COUNT = 12;

export const BookingCalendarSkeleton: React.FC<
  BookingCalendarSkeletonProps
> = ({ type }) => {
  if (type === "subjectSelection") {
    return (
      <div className={styles.skeletonSubjectWrapper}>
        <Skeleton width={60} height={60} />
        <Skeleton height={32} width={425} />
        <Skeleton height={147} />
      </div>
    );
  }
  if (type === "calendar") {
    return (
      <div className={styles.skeletonWrapper}>
        <div className={styles.headerSkeleton}>
          <div className={styles.skeletonSpaceBetween}>
            <Skeleton width={264} height={40} borderRadius={10} />
            <Skeleton width={250} height={40} borderRadius={10} />
          </div>
          <div className={styles.skeletonSpaceBetween}>
            <Skeleton width={287} height={36} borderRadius={10} />
            <Skeleton width={425} height={36} borderRadius={10} />
          </div>
        </div>
        <ul className={styles.skeletonDaysList}>
          {Array.from({ length: SKELETON_DAYS_COUNT }).map((_, index) => (
            <li key={index}>
              <Skeleton width={100} height={45} borderRadius={10} />
              <ul className={styles.skeletonHoursList}>
                {Array.from({ length: DAILY_SLOTS_COUNT }).map((_, index) => (
                  <li key={index}>
                    <Skeleton width={37} height={20} borderRadius={10} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className={styles.skeletonWarningMessage}>
            <Skeleton height={40} borderRadius={10}/>
        </div>
      </div>
    );
  }
};
