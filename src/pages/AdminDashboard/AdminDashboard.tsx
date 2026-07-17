import React from 'react';
import { useTranslation } from 'react-i18next';
import { RequestCard, ScheduleView } from './components';
import type { PendingRequest, TeacherColumn } from './components';
import styles from './AdminDashboard.module.scss';

const mockRequests: PendingRequest[] = [
  {
    id: '1',
    studentName: 'Sofiia Melnyk',
    email: 'viktoriia.polishchuk@ukr.net',
    subject: 'History',
    dateTime: '6/07 at 14:00',
    isActive: true,
    subjectColor: '#A855F7',
  },
  {
    id: '2',
    studentName: 'Piotr Mazur',
    email: '314mazur@interia.pl',
    subject: 'Chemistry',
    dateTime: '14/07 at 16:00',
    isActive: false,
    subjectColor: '#0D9488',
  },
  {
    id: '3',
    studentName: 'Michał Zieliński',
    email: 'michu_zieli69@onet.pl',
    subject: 'English',
    dateTime: '15/07 at 12:00',
    isActive: true,
    subjectColor: '#F43F5E',
  }
];

const mockTeachersData: TeacherColumn[] = [
  {
    id: 't1',
    name: 'Sofia Koval',
    themeClass: styles.green,
    slots: [
      { time: '9:00', type: 'empty' },
      { time: '10:00', type: 'booked', title: 'Mariia Honcharova' },
      { time: '11:00', type: 'booked', title: 'Mariia Honcharova' },
      { time: '12:00', type: 'lunch' },
      { time: '13:00', type: 'empty' },
      { time: '14:00', type: 'empty' },
      { time: '15:00', type: 'booked', title: 'Artem Kravchenko' },
      { time: '16:00', type: 'empty' },
      { time: '17:00', type: 'empty' },
      { time: '18:00', type: 'empty' },
      { time: '19:00', type: 'booked', title: 'Michał Zieliński' },
      { time: '20:00', type: 'empty' },
    ]
  },
  {
    id: 't2',
    name: 'Dmytro Kozak',
    themeClass: styles.blue,
    slots: [
      { time: '9:00', type: 'empty' },
      { time: '10:00', type: 'empty' },
      { time: '11:00', type: 'empty' },
      { time: '12:00', type: 'empty' },
      { time: '13:00', type: 'empty' },
      { time: '14:00', type: 'empty' },
      { time: '15:00', type: 'empty' },
      { time: '16:00', type: 'empty' },
      { time: '17:00', type: 'empty' },
      { time: '18:00', type: 'empty' },
      { time: '19:00', type: 'booked', title: 'Daria Tkachuk' },
      { time: '20:00', type: 'empty' },
    ]
  },
  {
    id: 't3',
    name: 'Andrii Shevchenko',
    themeClass: styles.cyan,
    slots: [
      { time: '9:00', type: 'empty' },
      { time: '10:00', type: 'booked', title: 'Piotr Mazur' },
      { time: '11:00', type: 'empty' },
      { time: '12:00', type: 'empty' },
      { time: '13:00', type: 'lunch' },
      { time: '14:00', type: 'booked', title: 'Artem Kravchenko' },
      { time: '15:00', type: 'empty' },
      { time: '16:00', type: 'empty' },
      { time: '17:00', type: 'booked', title: 'Oleksandr Boyko' },
      { time: '18:00', type: 'empty' },
      { time: '19:00', type: 'empty' },
      { time: '20:00', type: 'empty' },
    ]
  },
  {
    id: 't4',
    name: 'Anna Kowalska',
    themeClass: styles.rose,
    slots: [
      { time: '9:00', type: 'empty' },
      { time: '10:00', type: 'empty' },
      { time: '11:00', type: 'empty' },
      { time: '12:00', type: 'booked', title: 'Bohdan Samchuk' },
      { time: '13:00', type: 'lunch' },
      { time: '14:00', type: 'booked', title: 'Sofiia Melnyk' },
      { time: '15:00', type: 'empty' },
      { time: '16:00', type: 'empty' },
      { time: '17:00', type: 'booked', title: 'Daria Tkachuk' },
      { time: '18:00', type: 'empty' },
      { time: '19:00', type: 'empty' },
      { time: '20:00', type: 'empty' },
    ]
  },
  {
    id: 't5',
    name: 'Maksym Moroz',
    themeClass: styles.purple,
    slots: [
      { time: '9:00', type: 'empty' },
      { time: '10:00', type: 'empty' },
      { time: '11:00', type: 'empty' },
      { time: '12:00', type: 'empty' },
      { time: '13:00', type: 'lunch' },
      { time: '14:00', type: 'empty' },
      { time: '15:00', type: 'empty' },
      { time: '16:00', type: 'empty' },
      { time: '17:00', type: 'empty' },
      { time: '18:00', type: 'empty' },
      { time: '19:00', type: 'empty' },
      { time: '20:00', type: 'empty' },
    ]
  }
];

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        <main className={styles.leftColumn}>
          <ScheduleView teachersData={mockTeachersData} />
        </main>

        <aside className={styles.rightColumn}>
          <div className={styles.pendingContainer}>
            <div className={styles.pendingHeader}>
              <h3>{t("dashboard.pendingRequests")}</h3>
              <span className={styles.badgeCount}>3</span>
            </div>
            <p className={styles.pendingSub}>
              {t("dashboard.pendingSub")}
            </p>

            <div className={styles.requestsList}>
              {mockRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>

            <p className={styles.moreRequestsInfo}>
              <span className={styles.greyDot}></span> {t("dashboard.moreAttention")}
            </p>

            <button className={styles.viewAllBtn}>{t("dashboard.viewAll")} &rarr;</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
