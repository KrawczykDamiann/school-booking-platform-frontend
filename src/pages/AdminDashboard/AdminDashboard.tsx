import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslatedText } from '../../hooks/useTranslatedText';
import styles from './AdminDashboard.module.scss';

// Dynamic in-flight translation helper
const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

interface PendingRequest {
  id: string;
  studentName: string;
  email: string;
  subject: string;
  dateTime: string;
  status: 'active' | 'new';
  subjectColor: string;
}

interface TeacherWorkload {
  id: number;
  name: string;
  color: string;
  avatar?: string;
  bookedSlots: number;
  totalSlots: number;
}

const INITIAL_TEACHERS_WORKLOAD: TeacherWorkload[] = [
  {
    id: 1,
    name: 'Kataryna Novak',
    color: '#00d2ff',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bookedSlots: 4,
    totalSlots: 8,
  },
  {
    id: 2,
    name: 'Andrii Shevchenko',
    color: '#00c4b4',
    bookedSlots: 3,
    totalSlots: 8,
  },
  {
    id: 3,
    name: 'Sofia Koval',
    color: '#38ef7d',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bookedSlots: 4,
    totalSlots: 8,
  },
  {
    id: 4,
    name: 'Nataliia Ivanenko',
    color: '#b155fc',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bookedSlots: 4,
    totalSlots: 8,
  },
  {
    id: 5,
    name: 'Olena Melnyk',
    color: '#fbad34',
    bookedSlots: 4,
    totalSlots: 8,
  },
  {
    id: 6,
    name: 'Dmytro Kozak',
    color: '#3b82f6',
    avatar: 'https://i.pravatar.cc/150?img=60',
    bookedSlots: 1,
    totalSlots: 8,
  },
  {
    id: 7,
    name: 'Maksym Bondarenko',
    color: '#ff9ff3',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bookedSlots: 3,
    totalSlots: 8,
  },
  {
    id: 8,
    name: 'Anna Kowalska',
    color: '#ff4757',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bookedSlots: 3,
    totalSlots: 7,
  },
];

const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: '1',
    studentName: 'Sofiia Melnyk',
    email: 'viktoriia.polishchuk@ukr.net',
    subject: 'History',
    dateTime: '6/07 at 14:00',
    status: 'active',
    subjectColor: '#a855f7',
  },
  {
    id: '2',
    studentName: 'Piotr Mazur',
    email: '314mazur@interia.pl',
    subject: 'Chemistry',
    dateTime: '14/07 at 16:00',
    status: 'new',
    subjectColor: '#00d2ff',
  },
  {
    id: '3',
    studentName: 'Michał Zieliński',
    email: 'michu_zieli69@onet.pl',
    subject: 'English',
    dateTime: '15/07 at 12:00',
    status: 'active',
    subjectColor: '#ff4757',
  },
];

// Formats date to match Figma design (e.g., "July, the 6th")
const formatFigmaDate = (date: Date): string => {
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();

  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';

  return `${month}, the ${day}${suffix}`;
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 6, 6));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [requests, setRequests] = useState<PendingRequest[]>(INITIAL_REQUESTS);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  };

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
    setIsCalendarOpen(false);
  };

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTeacherClick = (teacherId: number) => {
    navigate(`/admin/teachers?teacherId=${teacherId}`);
  };

  // Month grid calculations (Monday-based index)
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        
        {/* Left Column: Teacher Workload */}
        <main className={styles.workloadCard}>
          <div className={styles.cardHeader}>
            <h2><Txt>Teacher workload</Txt></h2>

            <div className={styles.datePickerWrapper} ref={calendarRef}>
              <div className={styles.datePicker}>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handlePrevDay}
                  aria-label="Previous day"
                >
                  &lsaquo;
                </button>

                <button
                  type="button"
                  className={styles.dateTriggerBtn}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span className={styles.calIcon}>📅</span>
                  <span className={styles.dateText}>
                    <Txt>{formatFigmaDate(selectedDate)}</Txt>
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handleNextDay}
                  aria-label="Next day"
                >
                  &rsaquo;
                </button>
              </div>

              {isCalendarOpen && (
                <div className={styles.calendarBubble}>
                  <div className={styles.bubbleHeader}>
                    <h4>{selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h4>
                  </div>

                  <div className={styles.weekDaysRow}>
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>

                  <div className={styles.daysGrid}>
                    {Array.from({ length: offset }).map((_, i) => (
                      <span key={`empty-${i}`} className={styles.emptyDay} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const isCurrent = dayNum === selectedDate.getDate();
                      return (
                        <button
                          key={dayNum}
                          type="button"
                          className={`${styles.dayBtn} ${isCurrent ? styles.activeDay : ''}`}
                          onClick={() => handleSelectDay(dayNum)}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.workloadTable}>
              <thead>
                <tr>
                  <th className={styles.thName}><Txt>Teacher's name</Txt></th>
                  <th className={styles.thWorkload}><Txt>Today's workload</Txt></th>
                  <th className={styles.thCounter}><Txt>Counter</Txt></th>
                  <th className={styles.thView}><Txt>View</Txt></th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_TEACHERS_WORKLOAD.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className={styles.tableRow}
                    onClick={() => handleTeacherClick(teacher.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTeacherClick(teacher.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className={styles.nameCell}>
                      {teacher.avatar ? (
                        <img src={teacher.avatar} alt={teacher.name} className={styles.avatarImg} />
                      ) : (
                        <div
                          className={styles.avatarFallback}
                          style={{ backgroundColor: `${teacher.color}25`, color: teacher.color }}
                        >
                          {teacher.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                      )}
                      <span className={styles.teacherNameText}>{teacher.name}</span>
                    </td>

                    <td className={styles.workloadCell}>
                      <div className={styles.dotsBar}>
                        {Array.from({ length: teacher.totalSlots }).map((_, index) => {
                          const isBooked = index < teacher.bookedSlots;
                          return (
                            <span
                              key={index}
                              className={`${styles.workloadDot} ${isBooked ? styles.booked : styles.empty}`}
                              style={{ backgroundColor: isBooked ? teacher.color : undefined }}
                            />
                          );
                        })}
                      </div>
                    </td>

                    <td className={styles.counterCell}>
                      <div className={styles.counterBox}>
                        <span className={styles.counterValue}>
                          {teacher.bookedSlots} / {teacher.totalSlots}
                        </span>
                        <span className={styles.counterLabel}><Txt>slots</Txt></span>
                      </div>
                    </td>

                    <td className={styles.viewCell}>
                      <button
                        type="button"
                        className={styles.chevronBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTeacherClick(teacher.id);
                        }}
                        aria-label={`View ${teacher.name} details`}
                      >
                        &rsaquo;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right Column: Pending Requests */}
        <aside className={styles.pendingContainer}>
          <div className={styles.pendingHeader}>
            <h3><Txt>Pending requests</Txt></h3>
            <span className={styles.badgeCount}>{requests.length + 2}</span>
          </div>
          <p className={styles.pendingSub}>
            <Txt>Accept or decline booking requests that require admin attention.</Txt>
          </p>

          <div className={styles.requestsList}>
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} className={styles.requestCard}>
                  <div className={styles.requestTopRow}>
                    <h4 className={styles.studentName}>{req.studentName}</h4>
                    <span
                      className={
                        req.status === 'active' ? styles.statusActive : styles.statusNew
                      }
                    >
                      <Txt>{req.status === 'active' ? 'Active' : 'New'}</Txt>
                    </span>
                  </div>
                  <span className={styles.studentEmail}>{req.email}</span>

                  <div className={styles.requestDetails}>
                    <span className={styles.dot} style={{ backgroundColor: req.subjectColor }}></span>
                    <span><Txt>{req.subject}</Txt>, <Txt>{req.dateTime}</Txt></span>
                  </div>

                  <div className={styles.requestActions}>
                    <button
                      type="button"
                      className={styles.btnDetails}
                      onClick={() => navigate('/admin/students')}
                    >
                      <Txt>Details</Txt>
                    </button>
                    <button
                      type="button"
                      className={styles.btnAccept}
                      onClick={() => handleAcceptRequest(req.id)}
                    >
                      <Txt>Accept</Txt>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.allDoneMessage}><Txt>All requests handled!</Txt></p>
            )}
          </div>

          <p className={styles.moreRequestsInfo}>
            <span className={styles.greyDot}></span> 2 <Txt>more active requests requiring your attention</Txt>
          </p>

          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => navigate('/admin/students')}
          >
            <Txt>View all</Txt> &rarr;
          </button>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;