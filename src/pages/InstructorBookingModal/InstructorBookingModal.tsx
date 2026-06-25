import React from 'react';
import styles from './InstructorBookingModal.module.scss';
import { BookingCalendar } from '../BookingCalendar/BookingCalendar';
import { useTranslation } from 'react-i18next';

// Define the precise structure for incoming raw slots from the calendar component
interface BookingSlot {
  id: string;
  dayKey: string;
  dateNum: string;
  time: string;
}

export interface StudentScheduleItem {
  id: string;
  instructorId: number;
  instructorName: string;
  dayKey: string;
  dateNum: string;
  time: string;
}

interface ModalProps {
  instructor: {
    id: number;
    name: string;
    specialization: string;
    avatar: string;
  } | null;
  onClose: () => void;
}

export const InstructorBookingModal = ({ instructor, onClose }: ModalProps) => {
  const { t } = useTranslation();

  if (!instructor) return null;

  // FIXED: Replaced "any[]" with the strictly typed "BookingSlot[]" array
  const handleSaveToScheduleAndClose = (slots: BookingSlot[]) => {
    const studentScheduleItems: StudentScheduleItem[] = slots.map((slot) => ({
      id: slot.id,
      instructorId: instructor.id,
      instructorName: instructor.name,
      dayKey: slot.dayKey,
      dateNum: slot.dateNum,
      time: slot.time,
    }));

    console.log("Saving items directly to student schedule context:", studentScheduleItems);

    const summary = slots
      .map((s) => `${t(s.dayKey)} (${s.dateNum}) @ ${s.time}`)
      .join("\n");
    
    alert(t("calendar.addedToStudentSchedule", { name: instructor.name, summary }));
    
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.instructorHeader}>
          <img src={instructor.avatar} alt={instructor.name} className={styles.avatar} />
          <div className={styles.instructorInfo}>
            <h2>{instructor.name}</h2>
            <p>{instructor.specialization}</p>
          </div>
        </div>

        <hr className={styles.divider} />

        <h3>{t("calendar.chooseTime")}</h3>
        
        <BookingCalendar onSaveToSchedule={handleSaveToScheduleAndClose} />
      </div>
    </div>
  );
};