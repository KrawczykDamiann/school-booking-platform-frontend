import React from "react";
import "./InstructorListPage.scss";
import { MailIcon } from "../../components/icons/MailIcon"; // Importing the MailIcon component for email links

// 1. Define the TypeScript interface for the Instructor data structure
export interface Instructor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  avatarUrl: string;
}
// 2. Create mock data to simulate a backend response
const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: "1",
    name: "Anna Kowalska",
    specialization: "Mathematics & Physics",
    email: "anna.kowalska@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Anna+Kowalska&background=random",
  },
  {
    id: "2",
    name: "Mark Johnson",
    specialization: "Computer Science",
    email: "mark.johnson@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Mark+Johnson&background=random",
  },
  {
    id: "3",
    name: "Emily Davis",
    specialization: "Literature & History",
    email: "emily.davis@school.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
  },
  {
    id: "4",
    name: "Michael Brown",
    specialization: "Biology & Chemistry",
    email: "michael.brown@school.com",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Michael+Brown&background=random",
  },
];

// 3. Main component function
export const InstructorListPage: React.FC = () => {
  return (
    <div className="instructor-page-container">
      {/* Header section of the page */}
      <header className="page-header">
        <h1>Instructors Directory</h1>
        <p>Manage and view all available teaching resources.</p>
      </header>

      {/* Grid container for displaying instructor cards */}
      <div className="instructor-grid">
        {MOCK_INSTRUCTORS.map((instructor) => (
          <article key={instructor.id} className="instructor-card">
            {/* Instructor Profile Picture */}
            <img
              src={instructor.avatarUrl}
              alt={`Profile picture of ${instructor.name}`}
              className="instructor-avatar"
            />

            {/* Instructor Details */}
            <div className="instructor-info">
              <h2 className="instructor-name">{instructor.name}</h2>
              <p className="instructor-specialization">
                {instructor.specialization}
              </p>
              <a
                href={`mailto:${instructor.email}`}
                className="instructor-email-button"
                aria-label={`Send an email to ${instructor.name}`}
                title={`Contact ${instructor.email}`}
              >
                <MailIcon className="mail-icon" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
