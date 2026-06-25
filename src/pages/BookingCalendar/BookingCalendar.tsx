import React, { useState } from "react";
import styles from "./BookingCalendar.module.scss";
import { useTranslation } from "react-i18next";

interface SelectedSlot {
  id: string;
  dayKey: string;
  dateNum: string;
  time: string;
}

interface BookingCalendarProps {
  // Renamed from onAddToCart to strictly represent direct database persistence
  onSaveToSchedule?: (slots: SelectedSlot[]) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ onSaveToSchedule }) => {
  const { t } = useTranslation();

  // Mock schedule database keys matching your localized JSON dictionaries
  const availableDays = [
    { id: 1, dayKey: "calendar.days.monday", dateNum: "29.06", slots: ["14:00", "14:30", "15:00", "15:30"] },
    { id: 2, dayKey: "calendar.days.wednesday", dateNum: "01.07", slots: ["14:00", "15:00", "16:30"] }
  ];

  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  const handleSlotToggle = (dayKey: string, dateNum: string, time: string, uniqueId: string) => {
    setSelectedSlots((prevSelected) => {
      const isAlreadySelected = prevSelected.some((slot) => slot.id === uniqueId);

      if (isAlreadySelected) {
        return prevSelected.filter((slot) => slot.id !== uniqueId);
      } else {
        return [...prevSelected, { id: uniqueId, dayKey, dateNum, time }];
      }
    });
  };

  const handleConfirmClick = () => {
    if (selectedSlots.length > 0 && onSaveToSchedule) {
      onSaveToSchedule(selectedSlots);
      setSelectedSlots([]); // Clear local selection array upon successful save dispatch
    }
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.cardsContainer}>
        {availableDays.map((day) => (
          <div key={day.id} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              {t(day.dayKey)} <span>{day.dateNum}</span>
            </div>
            
            <div className={styles.slotsGrid}>
              {day.slots.map((slot) => {
                const uniqueId = `${day.id}-${slot}`;
                const isSelected = selectedSlots.some((s) => s.id === uniqueId);

                return (
                  <button 
                    key={slot} 
                    className={`${styles.timeSlot} ${isSelected ? styles.timeSlotActive : ""}`}
                    onClick={() => handleSlotToggle(day.dayKey, day.dateNum, slot, uniqueId)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action button targeting direct timeline confirmation with dynamic counters */}
      <button 
        className={styles.saveToScheduleBtn} 
        disabled={selectedSlots.length === 0}
        onClick={handleConfirmClick}
      >
        {selectedSlots.length > 0 
          ? t("calendar.saveToScheduleCount", { count: selectedSlots.length }) 
          : t("calendar.saveToSchedule")
        }
      </button>
    </div>
  );
};
