import { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";
import styles from "./styles.module.scss";

export type Subject1 = {
  id: number;
  name: string;
  description: string;
};

export type Teacher = {
  uuid: string;
  emailId: number;
  subjectId: number;
  firstName: string;
  lastName: string;
  zoneId: string;
};

export type Lesson1 = {
  uuid: string;
  startTime: Date;
  subjectId: number;
  teacherUuid: string;
  maxEnrolled: number;
  enrolled: number;
  closingTime: Date;
};

export type AvailabilitySlot = {
  teachers: [
    {
      uuid: string;
      firstName: string;
      lastName: string;
    },
  ];
  uuid: string;
  timestamp: string;
};

export const BookingLesson: React.FC = () => {
  // #region SUBJECT
  const subjectRef = useRef<HTMLInputElement>(null);
  const [subjects, setSubjects] = useState<Subject1[] | null>(null);
  const [selectedSubjectUuid, setSelectedSubjectUuid] = useState<string>("");

  const createSubject = async (name: string) => {
    const data = {
      name,
      description: `${name} basic`,
    };

    const response = await api.post("/api/subjects", data);
    setSubjects((prev) => [...(prev ?? []), response.data]);

    if (subjectRef.current) {
      subjectRef.current.value = "";
    }
  };
  // #endregion

  // #region TEACHERS
  const teacherRef = useRef<HTMLInputElement>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [selectedTeacherUuid, setSelectedTeacherUuid] = useState<string>("");

  const createTeacher = async (fullName: string) => {
    const arr = fullName.split(" ");
    const defaultSubjectId = subjects && subjects.length > 0 ? subjects[0].id : 1;
    const chosenSubjectId = selectedSubjectUuid ? Number(selectedSubjectUuid) : defaultSubjectId;

    const data = {
      email: `${arr[0]}.${arr[1] || "teacher"}@example.com`,
      subjectId: chosenSubjectId,
      firstName: arr[0] || "Unknown",
      lastName: arr[1] || "Teacher",
      zoneId: "Europe/Kyiv",
    };

    const response = await api.post("/api/teachers", data);
    setTeachers((prev) => [...(prev ?? []), response.data]);

    if (teacherRef.current) {
      teacherRef.current.value = "";
    }
  };

  const addAvailability = async () => {
    if (!selectedTeacherUuid) return;

    const body = {
      monday: { startTime: "10:00", endTime: "18:00" },
      tuesday: { startTime: "10:00", endTime: "18:00" },
      wednesday: { startTime: "10:00", endTime: "18:00" },
      thursday: { startTime: "10:00", endTime: "18:00" },
      friday: { startTime: "10:00", endTime: "18:00" },
      lunchBreak: { startTime: "13:00", endTime: "14:00" },
    };

    await api.patch(`/api/teachers/${selectedTeacherUuid}/availability`, body);
  };

  const createAvailabilityStotsForTeacher = async () => {
    if (!selectedTeacherUuid) return;
    await api.post(`/api/teachers/${selectedTeacherUuid}/availability/slots`);
  };
  // #endregion

  // #region AVAILABILITY_SLOTS
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[] | null>(null);
  const [selectedSlotUuid, setSelectedSlotUuid] = useState<string>("");
  // #endregion

  // #region LESSONS
  const [lessons, setLessons] = useState<Lesson1[] | null>(null);

  const createLesson = async () => {
    if (!selectedSlotUuid || !selectedTeacherUuid) return;

    const data = {
      availabilitySlotUuid: selectedSlotUuid,
      teacherUuid: selectedTeacherUuid,
      maxEnrolled: 5,
    };
    await api.post("/api/lessons", data);
  };
  // #endregion

  useEffect(() => {
    const initSubjects = async () => {
      const res = await api.get("/api/subjects");
      setSubjects(res.data.content);
    };
    initSubjects();
  }, []);

  useEffect(() => {
    const initTeachers = async () => {
      const res = await api.get("/api/teachers");
      setTeachers(res.data.content);
    };
    initTeachers();
  }, []);

  useEffect(() => {
    const initAvailabilitySlots = async () => {
      const res = await api.get("/api/availability-slots");
      setAvailabilitySlots(res.data.content);
    };
    initAvailabilitySlots();
  }, []);

  useEffect(() => {
    const initLessons = async () => {
      const res = await api.get("/api/lessons");
      setLessons(res.data.content);
    };
    initLessons();
  }, []);

  const visibleSubjects = subjects;
  const visibleTeachers = teachers;

  return (
    <div className={styles.content}>
      <div className={styles.data}>
        {/* SUBJECT */}
        <h2 className={styles.title}>Creating a Subjects</h2>
        <div className={styles.row}>
          <input type="text" name="subject" id="subject" ref={subjectRef} />
          <button
            type="button"
            onClick={() => createSubject(subjectRef.current?.value ?? "")}
            className={styles.actionButton}
          >
            Create Subject
          </button>
          <ul className={styles.list}>
            {visibleSubjects &&
              visibleSubjects.map((s) => (
                <li className={styles.item} key={s.id}>
                  {s.name}
                </li>
              ))}
          </ul>
        </div>

        {/* TEACHER */}
        <h2 className={styles.title}>Creating a Teacher</h2>
        <div className={styles.row}>
          <input type="text" name="teacher" id="teacher" ref={teacherRef} />
          <span>Select a subject</span>
          <select
            value={selectedSubjectUuid}
            onChange={(e) => setSelectedSubjectUuid(e.target.value)}
          >
            <option value="">Subjects:</option>
            {subjects?.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => createTeacher(teacherRef.current?.value ?? "")}
          >
            Create Teacher
          </button>
        </div>

        {/* AVAILABILITY */}
        <h2 className={styles.title}>
          Creating a Availabillity and Availabillity Slot
        </h2>
        <div className={styles.row}>
          <span>Select a teacher and subject</span>
          <select
            value={selectedTeacherUuid}
            onChange={(e) => setSelectedTeacherUuid(e.target.value)}
          >
            <option value="">Teachers:</option>
            {visibleTeachers &&
              visibleTeachers.map((t) => (
                <option key={t.uuid} value={t.uuid}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
          </select>
          <button type="button" className={styles.actionButton} onClick={addAvailability}>
            Add Availability
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={createAvailabilityStotsForTeacher}
          >
            Generate availability slot
          </button>
        </div>

        <div className={styles.row}>
          <span>Select a availability slot and Teacher</span>
          <select
            value={selectedSlotUuid}
            onChange={(e) => setSelectedSlotUuid(e.target.value)}
          >
            <option value="">Availability Slots:</option>
            {availabilitySlots &&
              availabilitySlots.map((s) => (
                <option key={s.uuid} value={s.uuid}>
                  {s.timestamp} {s.uuid}
                </option>
              ))}
          </select>
          <button type="button" className={styles.actionButton} onClick={createLesson}>
            Create Lesson
          </button>
        </div>

        {/* LESSON */}
        <h2 className={styles.title}>Creating a Lesson</h2>
        <div className={styles.row}>
          <ul>
            Lessons id list:
            {lessons?.map((l) => (
              <li key={l.uuid}>{l.uuid}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
