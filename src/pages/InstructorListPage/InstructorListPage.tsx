import React, { useState, useEffect } from "react";
import "./InstructorListPage.scss";
import { MailIcon } from "../../components/icons/MailIcon";
import { useTranslation } from "react-i18next";

// Define the shape of the finalized instructor object with structured translations
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
}

// Define the raw incoming data shape where the admin provides text in ANY language
interface RawInstructor {
  id: string;
  name: string;
  specializationRaw: string; // Dynamic input string (can be PL, EN, or UA)
  email: string;
  avatarUrl: string;
}

// Mock data simulating mixed language entries from different administrators
const RAW_MOCK_INSTRUCTORS: RawInstructor[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    specializationRaw: "Mathematics and physics", // Entered in English
    email: "anna.kowalska@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Anna+Kowalska&background=random",
  },
  {
    id: "2",
    name: "Mark Johnson",
    specializationRaw: "Informatyka", // Entered in Polish
    email: "mark.johnson@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Mark+Johnson&background=random",
  },
  {
    id: "3",
    name: "Emily Davis",
    specializationRaw: "Література та історія", // Entered in Ukrainian
    email: "emily.davis@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
  },
  {
    id: "4",
    name: "Michael Brown",
    specializationRaw: "Biology and chemistry", // Entered in English
    email: "michael.brown@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Michael+Brown&background=random",
  },
  {
    id: "5",
    name: "Sophia Wilson",
    specializationRaw: "Sztuka i design", // Entered in Polish/English mixed
    email: "sophia.wilson@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Sophia+Wilson&background=random",
  },
  {
    id: "6",
    name: "James Taylor",
    specializationRaw: "Економіка та бізнес", // Entered in Ukrainian
    email: "james.taylor@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=James+Taylor&background=random",
  },
];

// Helper asynchronous function utilizing 'autodetect' with built-in validation error bypass
const translateText = async (
  text: string,
  targetLang: "pl" | "en" | "uk",
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetLang}`,
    );
    const data = await response.json();
    const translatedText = data.responseData?.translatedText;

    // Catch MyMemory's specific error when the detected source matches the requested target language
    if (
      translatedText === "PLEASE SELECT TWO DISTINCT LANGUAGES" ||
      !translatedText
    ) {
      return text; // Fallback directly to the original input text since it is already in that language
    }

    return translatedText;
  } catch (error) {
    console.error("Translation API Error:", error);
    return text; // Fallback to original input text if the remote service drops
  }
};

export const InstructorListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // State to hold the processed instructors list with dynamic translations
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(true);

  const currentLang = i18n.language as "pl" | "en" | "ua";
  const totalItems = RAW_MOCK_INSTRUCTORS.length;
  const radius = 200; // Radius of the 2D circle plane in pixels

  // Automatically trigger translation pipeline on component mount
  useEffect(() => {
    const bootstrapTranslations = async () => {
      setIsTranslating(true);

      const processedList = await Promise.all(
        RAW_MOCK_INSTRUCTORS.map(async (item) => {
          // Fire translation requests for all three target system languages simultaneously
          const plTranslation = await translateText(
            item.specializationRaw,
            "pl",
          );
          const enTranslation = await translateText(
            item.specializationRaw,
            "en",
          );
          const uaTranslation = await translateText(
            item.specializationRaw,
            "uk",
          );

          return {
            id: item.id,
            name: item.name,
            email: item.email,
            avatarUrl: item.avatarUrl,
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

  // Display a fallback screen while the background translation machine is processing
  if (isTranslating) {
    return (
      <div
        className="instructor-page-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#fff" }}>Loading automated translations...</h1>
      </div>
    );
  }

  return (
    <div className="instructor-page-container">
      <header className="page-header">
        <h1>{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </header>

      {/* Flat 2D Viewport container */}
      <div className="carousel-2d-scene">
        <div className="carousel-2d-circle">
          {instructors.map((instructor, index) => {
            // Calculate relative mathematical angle so the active item lands at -90 deg (Top / 12 o'clock)
            const angleDegree = (index - activeIndex) * (360 / totalItems) - 90;
            const angleRadians = (angleDegree * Math.PI) / 180;

            // 2D Cartesian coordinates using standard math formulas (X = R * cos, Y = R * sin)
            const x = radius * Math.cos(angleRadians);
            const y = radius * Math.sin(angleRadians);

            // Establish strict 2D visual hierarchy layers based on proximity to active index
            const diff =
              (((index - activeIndex) % totalItems) + totalItems) % totalItems;
            const distanceToActive = Math.min(diff, totalItems - diff);

            let scale = 0.75;
            let opacity = 0.4;
            let zIndex = 1;

            if (distanceToActive === 0) {
              scale = 1.1; // Selected item pops out forward in 2D scale
              opacity = 1; // Fully visible
              zIndex = 10; // Higher layer stack order
            } else if (distanceToActive === 1) {
              scale = 0.9; // Side items are slightly smaller
              opacity = 0.7; // Translucent
              zIndex = 5; // Middle layer stack order
            }

            return (
              <article
                key={instructor.id}
                className={`instructor-card ${distanceToActive === 0 ? "instructor-card--active" : ""}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={instructor.avatarUrl}
                  alt={`Profile picture of ${instructor.name}`}
                  className="instructor-avatar"
                />
                <div className="instructor-info">
                  <h2 className="instructor-name">{instructor.name}</h2>
                  <p className="instructor-specialization">
                    {/* Render the dynamically translated text straight from the object payload state */}
                    {instructor.specialization[currentLang] ||
                      instructor.specialization.en}
                  </p>
                  <a
                    href={`mailto:${instructor.email}`}
                    className="instructor-email-button"
                    aria-label={`Send an email to ${instructor.name}`}
                  >
                    <MailIcon className="mail-icon" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="carousel-controls">
        <button
          className="control-btn"
          onClick={() => setActiveIndex((prev) => prev + 1)}
        >
          ‹
        </button>
        <button
          className="control-btn"
          onClick={() => setActiveIndex((prev) => prev - 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};
