import React, { useState } from 'react';
import styles from './TeacherListPage.module.scss';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  subjectColor: string;
  collabType: 'Contract' | 'Freelance';
  dueDate: string | null;
  avatar?: string;
  nextLessons?: string[];
}

const INITIAL_TEACHERS: Teacher[] = [
  { id: 1, name: 'Kataryna Novak', email: 'k.nowakchemistry@onlineschool.com', subject: 'Chemistry', subjectColor: '#00d2ff', collabType: 'Contract', dueDate: 'Without term', nextLessons: ['28/06 at 14:00', '15:00', '17:00'] },
  { id: 2, name: 'Andrii Shevchenko', email: 'a.shevchenko@onlineschool.com', subject: 'Maths', subjectColor: '#00f2fe', collabType: 'Freelance', dueDate: 'Without term' },
  { id: 3, name: 'Sofia Koval', email: 's.koval@onlineschool.com', subject: 'Physics', subjectColor: '#38ef7d', collabType: 'Contract', dueDate: '26/10/26' },
  { id: 4, name: 'Nataliia Ivanenko', email: 'n.ivanenko@onlineschool.com', subject: 'Biology', subjectColor: '#b155fc', collabType: 'Contract', dueDate: '31/8/27' },
  { id: 5, name: 'Olena Melnyk', email: 'o.melnyk@onlineschool.com', subject: 'Literature', subjectColor: '#fbad34', collabType: 'Contract', dueDate: '31/12/27' },
  { id: 6, name: 'Dmytro Kozak', email: 'd.kozak@onlineschool.com', subject: 'Ukrainian', subjectColor: '#ff7675', collabType: 'Freelance', dueDate: 'Without term' },
  { id: 7, name: 'Maksym Bondarenko', email: 'm.bondarenko@onlineschool.com', subject: 'History', subjectColor: '#ff9ff3', collabType: 'Contract', dueDate: '30/07/26' },
  { id: 8, name: 'Anna Kowalska', email: 'a.kowalska@onlineschool.com', subject: 'English', subjectColor: '#ff4757', collabType: 'Contract', dueDate: '27/04/27' },
];

const AVAILABLE_COLORS = ['#ff4757', '#fbad34', '#fec107', '#38ef7d', '#00f2fe', '#00d2ff', '#b155fc', '#ff9ff3'];

export const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(INITIAL_TEACHERS[0]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherColor, setNewTeacherColor] = useState('#00d2ff');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [collabType, setCollabType] = useState<'Contract' | 'Freelance'>('Contract');
  const [dueDate, setDueDate] = useState('2027-06-06');
  const [workFrom, setWorkFrom] = useState('09:00');
  const [workTo, setWorkTo] = useState('17:00');
  const [lunchFrom, setLunchFrom] = useState('12:00');
  const [lunchTo, setLunchTo] = useState('13:00');

  // Simulates email duplication check from the wireframe
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTeacherEmail(val);
    if (val === 'hello@school.com') {
      setEmailError('This email already exists in your list');
    } else {
      setEmailError('');
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && newTeacherName && newTeacherEmail && newTeacherSubject) {
      setModalStep(2);
    }
  };

  const handleSaveTeacher = () => {
    const created: Teacher = {
      id: teachers.length + 1,
      name: newTeacherName,
      email: newTeacherEmail,
      subject: newTeacherSubject,
      subjectColor: newTeacherColor,
      collabType: collabType,
      dueDate: collabType === 'Freelance' ? 'Without term' : new Date(dueDate).toLocaleDateString('en-GB'),
    };
    
    setTeachers([...teachers, created]);
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setNewTeacherName('');
    setNewTeacherSubject('');
    setNewTeacherEmail('');
    setEmailError('');
  };

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.topNav}>
        <span className={styles.logo}>Less<span>io</span></span>
        <div className={styles.navLinks}>
          <button>Dashboard</button>
          <button className={styles.activeTab}>Teachers</button>
          <button>Students</button>
          <button>More options ▾</button>
        </div>
        <div className={styles.userProfile}>VU</div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.listSection}>
          <div className={styles.tableHeader}>
            <h2>Teachers</h2>
            <button className={styles.addTeacherBtn} onClick={() => setIsModalOpen(true)}>
              Add a teacher <span>+</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.teachersTable}>
              <thead>
                <tr>
                  <th>Teacher's name</th>
                  <th>Subject</th>
                  <th>Work terms & Due date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr 
                    key={t.id} 
                    className={selectedTeacher?.id === t.id ? styles.activeRow : ''}
                    onClick={() => setSelectedTeacher(t)}
                  >
                    <td className={styles.nameCell}>
                      <div className={styles.avatarMock}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                      {t.name}
                    </td>
                    <td>
                      <span className={styles.subjectWrapper}>
                        <span className={styles.colorDot} style={{ backgroundColor: t.subjectColor }}></span>
                        {t.subject}
                      </span>
                    </td>
                    <td className={styles.termsCell}>
                      <span className={styles.collabType}>{t.collabType}</span>
                      <span className={styles.dueDate}>{t.dueDate}</span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.actionIconButton}>✏️</button>
                      <button className={styles.actionIconButton}>•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected instructor sidebar panel */}
        {selectedTeacher && (
          <aside className={styles.detailsCard}>
            <button className={styles.closeDetails} onClick={() => setSelectedTeacher(null)}>×</button>
            <h3>{selectedTeacher.name} <span className={styles.miniDot} style={{ backgroundColor: selectedTeacher.subjectColor }}></span></h3>
            <p className={styles.detailsEmail}>✉️ {selectedTeacher.email}</p>
            
            <div className={styles.nextLessonsSection}>
              <h4>Next lessons:</h4>
              {selectedTeacher.nextLessons ? (
                <ul>
                  {selectedTeacher.nextLessons.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noLessons}>No lessons scheduled.</p>
              )}
            </div>
            <a href="#teacher-page" className={styles.teacherPageLink}>Teacher's page →</a>
          </aside>
        )}
      </main>

      {/* Creation wizard modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button className={styles.closeModal} onClick={resetForm}>×</button>
            
            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                <h3>👤 Add a teacher <span className={styles.stepIndicator}>Step 1 of 2</span></h3>
                <p className={styles.subtitle}>Fill-in basic information</p>

                <div className={styles.inputGroup}>
                  <label>Name*</label>
                  <input 
                    type="text" 
                    placeholder="Olga Petrivna" 
                    required 
                    value={newTeacherName} 
                    onChange={(e) => setNewTeacherName(e.target.value)} 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Subject (required)</label>
                  <div className={styles.selectWithColor}>
                    <select 
                      required 
                      value={newTeacherSubject} 
                      onChange={(e) => setNewTeacherSubject(e.target.value)}
                    >
                      <option value="">Select a subject</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Maths">Maths</option>
                      <option value="Physics">Physics</option>
                    </select>
                    <span className={styles.selectedColorPreview} style={{ backgroundColor: newTeacherColor }}></span>
                  </div>
                  <p className={styles.hint}>Select a subject and a colour to mark in your schedule</p>
                </div>

                <div className={styles.colorPalette}>
                  {AVAILABLE_COLORS.map((c) => (
                    <button 
                      type="button"
                      key={c} 
                      className={`${styles.paletteDot} ${newTeacherColor === c ? styles.activePaletteDot : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewTeacherColor(c)}
                    />
                  ))}
                </div>

                <div className={`${styles.inputGroup} ${emailError ? styles.errorState : ''}`}>
                  <label>Email*</label>
                  <input 
                    type="email" 
                    placeholder="hello@school.com" 
                    required 
                    value={newTeacherEmail} 
                    onChange={handleEmailChange} 
                  />
                  {emailError && <span className={styles.errorText}>⚠️ {emailError}</span>}
                </div>

                <button type="submit" className={styles.primaryModalBtn}>Continue to availability</button>
                <button type="button" className={styles.secondaryModalBtn} onClick={handleSaveTeacher}>Save and set later</button>
              </form>
            ) : (
              <div>
                <h3>📅 Add a teacher <span className={styles.stepIndicator}>Step 2 of 2</span></h3>
                <p className={styles.subtitle}>Set teacher's availability</p>

                <h4 className={styles.sectionDivider}>Work terms</h4>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>Collaboration type*</label>
                    <select
                      value={collabType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCollabType(e.target.value as 'Contract' | 'Freelance')}
                    >
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Due Date*</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={collabType === 'Freelance'} />
                  </div>
                </div>

                <h4 className={styles.sectionDivider}>Regular availability</h4>
                <div className={styles.availabilityRow}>
                  <span>💼 Workdays</span>
                  <div className={styles.timeInputs}>
                    <input type="time" value={workFrom} onChange={(e) => setWorkFrom(e.target.value)} />
                    <span>—</span>
                    <input type="time" value={workTo} onChange={(e) => setWorkTo(e.target.value)} />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span>🍽️ Lunch break</span>
                  <div className={styles.timeInputs}>
                    <input type="time" value={lunchFrom} onChange={(e) => setLunchFrom(e.target.value)} />
                    <span>—</span>
                    <input type="time" value={lunchTo} onChange={(e) => setLunchTo(e.target.value)} />
                  </div>
                </div>

                <p className={styles.infoLink}>You can set individual per day later or <span className={styles.accentText}>add now</span></p>

                <button type="button" className={styles.primaryModalBtn} onClick={handleSaveTeacher}>Save teacher</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
