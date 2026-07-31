import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AdminDashboard.module.scss';

export interface PendingRequest {
  id: string;
  studentName: string;
  email: string;
  subject: string;
  dateTime: string;
  isActive: boolean;
  subjectColor: string;
}

export interface TimeSlot {
  time: string;
  type: 'empty' | 'booked' | 'lunch';
  title?: string;
}

export interface TeacherColumn {
  id: string;
  name: string;
  themeClass: string;
  slots: TimeSlot[];
}

export const RequestCard: React.FC<{ request: PendingRequest }> = ({ request }) => {
  const { t } = useTranslation();
  const subjectKey = `subjects.${request.subject.toLowerCase()}`;

  return (
    <div className={styles.requestCard}>
      {/* Header with student name and status badge aligned left */}
      <div className={styles.requestHeader}>
        <h4 className={styles.studentName}>{request.studentName}</h4>
        <span className={`${styles.studentStatus} ${request.isActive ? styles.statusActive : styles.statusNew}`}>
          {request.isActive ? t("dashboard.statusActive") : t("dashboard.statusNew")}
        </span>
      </div>
      
      {/* Email placed cleanly directly below the header row */}
      <span className={styles.studentEmail}>{request.email}</span>
      
      <p className={styles.requestDetails}>
        <span 
          className={styles.dot} 
          style={{ backgroundColor: request.subjectColor }}
        ></span> 
        {t(subjectKey)}, {request.dateTime}
      </p>

      <div className={styles.requestActions}>
        <button className={styles.btnDetails}>{t("dashboard.btnDetails")}</button>
        <button className={styles.btnAccept}>{t("dashboard.btnAccept")}</button>
      </div>
    </div>
  );
};

export const TeacherScheduleColumn: React.FC<{ teacher: TeacherColumn }> = ({ teacher }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.teacherColumn}>
      <div className={`${styles.columnHeader} ${teacher.themeClass}`}>
        <span className={styles.teacherNameText}>{teacher.name}</span>
        <span className={styles.arrowIcon}>&rarr;</span>
      </div>

      <div className={styles.slotsList}>
        {teacher.slots.map((slot, index) => {
          if (slot.type === 'booked') {
            return (
              <div key={index} className={`${styles.slotBadge} ${teacher.themeClass}`}>
                <span className={styles.slotTime}>{slot.time}</span>
                <span className={styles.slotTitle}>{slot.title}</span>
              </div>
            );
          }

          if (slot.type === 'lunch') {
            return (
              <div key={index} className={styles.lunchBadge}>
                <span className={styles.lunchTime}>{slot.time}</span>
                <span className={styles.lunchTitle}>{t("dashboard.lunchBreak")}</span>
              </div>
            );
          }

          return (
            <div key={index} className={styles.emptySlot}>
              {slot.time}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ScheduleView: React.FC<{ teachersData: TeacherColumn[] }> = ({ teachersData }) => {
  const { t } = useTranslation();

  const filterTeachers = [
    { name: 'Kataryna N.', color: '#FFD09B' },
    { name: 'Andrii Sh.', color: '#4ADE80' },
    { name: 'Sofia K.', color: '#60A5FA' },
    { name: 'Natalia I.', color: '#F472B6' },
    { name: 'Olena M.', color: '#FCD34D' },
    { name: 'Dmytro K.', color: '#93C5FD' },
  ];

  return (
    <div className={styles.scheduleCard}>
      <div className={styles.scheduleHeader}>
        <h3>{t("dashboard.schedule")}</h3>
        <div className={styles.datePicker}>
          <button className={styles.arrowBtn}>&lt;</button>
          <span>July, the 6th</span>
          <button className={styles.arrowBtn}>&gt;</button>
        </div>
      </div>

      <div className={styles.teachersFilter}>
        <span className={`${styles.teacherTag} ${styles.activeTag}`}>{t("dashboard.allTeachers")}</span>
        {filterTeachers.map((t, idx) => (
          <span key={idx} className={styles.teacherTag}>
            <span className={styles.colorIndicator} style={{ backgroundColor: t.color }}></span>
            {t.name}
          </span>
        ))}
      </div>

      <div className={styles.gridScrollContainer}>
        <div className={styles.columnsGrid}>
          {teachersData.map((teacher) => (
            <TeacherScheduleColumn key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </div>
  );
};