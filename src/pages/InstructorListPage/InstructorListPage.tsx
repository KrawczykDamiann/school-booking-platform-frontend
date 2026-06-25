import React, { useState, useEffect } from "react";
import styles from "./InstructorListPage.module.scss";
import { MailIcon } from "../../components/icons/MailIcon";
import { useTranslation } from "react-i18next";
import { InstructorBookingModal } from "../../pages/InstructorBookingModal/InstructorBookingModal";
import { FilterModal } from "../FilterModal/FilterModal";

// Data structures for safety and type enforcement
export interface Instructor {
  id: string;
  name: string;
  specialization: {
    pl: string;
    en: string;
    ua: string;
  };
  email: string;
  avatarUrl: string;
  category: string;
}

interface RawInstructor {
  id: string;
  name: string;
  specializationRaw: string;
  email: string;
  avatarUrl: string;
  category: string;
}

// Static fallback mockup data source
const RAW_MOCK_INSTRUCTORS: RawInstructor[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    specializationRaw: "Mathematics",
    email: "anna.kowalska@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Anna+Kowalska&background=random",
    category: "subjects.mathematics",
  },
  {
    id: "2",
    name: "Mark Johnson",
    specializationRaw: "Informatics and programming",
    email: "mark.johnson@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Mark+Johnson&background=random",
    category: "subjects.informatics",
  },
  {
    id: "3",
    name: "Emily Davis",
    specializationRaw: "Physics and quantum mechanics",
    email: "emily.davis@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
    category: "subjects.physics",
  },
  {
    id: "4",
    name: "Michael Brown",
    specializationRaw: "Biology and anatomy",
    email: "michael.brown@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Michael+Brown&background=random",
    category: "subjects.biology",
  },
  {
    id: "5",
    name: "Sophia Wilson",
    specializationRaw: "Organic chemistry",
    email: "sophia.wilson@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Sophia+Wilson&background=random",
    category: "subjects.chemistry",
  },
  {
    id: "6",
    name: "James Taylor",
    specializationRaw: "Economics and macrofinance",
    email: "james.taylor@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=James+Taylor&background=random",
    category: "subjects.economics",
  },
];

// Asynchronous fetch wrapper connecting to Google's public translation client
const translateText = async (text: string, targetLang: "pl" | "en" | "uk"): Promise<string> => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
    );
    if (!response.ok) throw new Error("Google Translation API error");
    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    return text;
  } catch (error) {
    console.error("Google Translation API Error:", error);
    return text;
  }
};

export const InstructorListPage: React.FC = () => {
  // Localization and layout state engines
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(true);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  // Filter modal coordination states
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | null>(null);

  const currentLang = i18n.language as "pl" | "en" | "ua";
  const radius = 200; // Radial separation distance for 3D sphere distribution

  // Localized user profile structure (Target for AuthContext integration later)
  const userProfile = {
    name: "Damian",
    tokens: 12,
    upcomingLesson: {
      instructor: "Emily Davis",
      subjectKey: "subjects.physics",
      timeKey: "dates.tomorrow",
      timeValue: "14:00"
    },
  };

  // Parallel background dictionary compiler resolving strings on initial load
  useEffect(() => {
    const bootstrapTranslations = async () => {
      setIsTranslating(true);
      const processedList = await Promise.all(
        RAW_MOCK_INSTRUCTORS.map(async (item) => {
          const plTranslation = await translateText(item.specializationRaw, "pl");
          const enTranslation = await translateText(item.specializationRaw, "en");
          const uaTranslation = await translateText(item.specializationRaw, "uk");

          return {
            id: item.id,
            name: item.name,
            email: item.email,
            avatarUrl: item.avatarUrl,
            category: item.category,
            specialization: {
              pl: plTranslation,
              en: enTranslation,
              ua: uaTranslation,
            },
          };
        }),
      );
      setInstructors(processedList);
      setIsTranslating(false);
    };
    bootstrapTranslations();
  }, []);

  // Atomic state batch modifier neutralizing index overflow during array reductions
  const handleFilterChange = (subject: string | null) => {
    setActiveSubjectFilter(subject);
    setActiveIndex(0);
  };

  // Runtime conditional pipeline mapping current list views
  const filteredInstructors = activeSubjectFilter
    ? instructors.filter((inst) => inst.category === activeSubjectFilter)
    : instructors;

  const totalItems = filteredInstructors.length;

  // Render blocking guard checking dictionary synchronization status
  if (isTranslating) {
    return (
      <div className={styles.loadingContainer}>
        <h1>Loading automated translations...</h1>
      </div>
    );
  }

  return (
    <div className={styles.instructorPageContainer}>
      
      {/* Brand signature header element */}
      <div className={styles.brandLogo}>
        <span className={styles.logoText}>Lessio</span>
        <span className={styles.logoDot}>.</span>
      </div>

      {/* Main dashboard content panel wrapper */}
      <header className={styles.pageHeader}>
        <div className={styles.userStatusRow}>
          <span className={styles.welcomeText}>
            {t("header.welcome") || "Witaj"}, <strong>{userProfile.name}</strong>! 👋
          </span>
          <div className={styles.tokenBadge}>
            <span className={styles.tokenIcon}>🪙</span>
            <span className={styles.tokenCount}>
              <strong>{userProfile.tokens}</strong> {t("header.tokens") || "Tokenów"}
            </span>
          </div>
        </div>

        <hr className={styles.headerDivider} />

        <h1>{t("title")}</h1>
        <p>{t("subtitle")}</p>

        {/* Live event reminder notice banner block */}
        {userProfile.upcomingLesson && (
          <div className={styles.upcomingLessonAlert}>
            <span className={styles.pulseDot}></span>
            <p>
              {t("header.nextLesson") || "Najbliższa lekcja:"}{" "}
              <strong>{t(userProfile.upcomingLesson.subjectKey)}</strong> {t("header.with") || "z"}{" "}
              {userProfile.upcomingLesson.instructor} —{" "}
              <span className={styles.lessonTime}>
                {t(userProfile.upcomingLesson.timeKey)}, {userProfile.upcomingLesson.timeValue}
              </span>
            </p>
          </div>
        )}

        <button
          className={styles.filterTriggerBtn}
          onClick={() => setIsFilterOpen(true)}
        >
          {activeSubjectFilter
            ? `${t("filters.active")}: ${t(activeSubjectFilter)}`
            : t("filters.buttonText")}
        </button>
      </header>

      {/* Cyclical 3D interactive wheel matrix */}
      <div className={styles.carousel2dScene}>
        <div className={styles.carousel2dCircle}>
          {filteredInstructors.map((instructor, index) => {
            // Coordinate mapping trigonometry establishing circular array distribution
            const angleDegree =
              totalItems > 0 ? (index - activeIndex) * (360 / totalItems) - 90 : -90;
            const angleRadians = (angleDegree * Math.PI) / 180;

            const x = radius * Math.cos(angleRadians);
            const y = radius * Math.sin(angleRadians);

            // Vector distance checking isolating node tracking indices
            const diff =
              totalItems > 0
                ? (((index - activeIndex) % totalItems) + totalItems) % totalItems
                : 0;
            const distanceToActive = Math.min(diff, totalItems - diff);

            // Dynamic depth simulation scalar values
            let scale = 0.75;
            let opacity = 0.4;
            let zIndex = 1;

            if (distanceToActive === 0) {
              scale = 1.1;
              opacity = 1;
              zIndex = 10;
            } else if (distanceToActive === 1) {
              scale = 0.9;
              opacity = 0.7;
              zIndex = 5;
            }

            return (
              <article
                key={instructor.id}
                className={`${styles.instructorCard} ${distanceToActive === 0 ? styles.instructorCardActive : ""}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                onClick={() => {
                  if (distanceToActive === 0) {
                    setSelectedInstructor(instructor);
                  } else {
                    setActiveIndex(index);
                  }
                }}
              >
                <img
                  src={instructor.avatarUrl}
                  alt={`Profile picture of ${instructor.name}`}
                  className={styles.instructorAvatar}
                />
                <div className={styles.instructorInfo}>
                  <h2 className={styles.instructorName}>{instructor.name}</h2>
                  <p className={styles.instructorSpecialization}>
                    {instructor.specialization[currentLang] || instructor.specialization.en}
                  </p>
                  <a
                    href={`mailto:${instructor.email}`}
                    className={styles.instructorEmailButton}
                    aria-label={`Send an email to ${instructor.name}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MailIcon className={styles.mailIcon} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel directional button navigation deck */}
        <div className={styles.carouselControls}>
          <button
            className={styles.controlBtn}
            onClick={() => setActiveIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0))}
          >
            ‹
          </button>
          <button
            className={styles.controlBtn}
            onClick={() => setActiveIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0))}
          >
            ›
          </button>
        </div>
      </div>

      {/* Layered modal action components */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedSubject={activeSubjectFilter}
        onSelectSubject={handleFilterChange}
      />

      {selectedInstructor && (
        <InstructorBookingModal
          instructor={{
            id: Number(selectedInstructor.id),
            name: selectedInstructor.name,
            specialization:
              selectedInstructor.specialization[currentLang] || selectedInstructor.specialization.en,
            avatar: selectedInstructor.avatarUrl,
          }}
          onClose={() => setSelectedInstructor(null)}
        />
      )}
    </div>
  );
};
