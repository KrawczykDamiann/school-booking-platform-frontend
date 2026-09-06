import chemistryIcon from "../../../assets/subjectsIcons/chemistry.svg";
import physicsIcon from "../../../assets/subjectsIcons/physics.svg";
import ukrainianIcon from "../../../assets/subjectsIcons/ukrainian.svg";
import biologyIcon from "../../../assets/subjectsIcons/biology.svg";
import historyIcon from "../../../assets/subjectsIcons/history.svg";
import literatureIcon from "../../../assets/subjectsIcons/literature.svg";
import englishIcon from "../../../assets/subjectsIcons/english.svg";
import mathematicsIcon from "../../../assets/subjectsIcons/mathematics.svg";
import polishIcon from "../../../assets/subjectsIcons/polish.svg";

type SubjectName =
  | "Chemistry"
  | "Ukrainian"
  | "Physics"
  | "Biology"
  | "History"
  | "Literature"
  | "English"
  | "Mathematics"
  | "Polish";

export const subjectIcons: Record<SubjectName, string> = {
  Chemistry: chemistryIcon,
  Ukrainian: ukrainianIcon,
  Physics: physicsIcon,
  Biology: biologyIcon,
  History: historyIcon,
  Literature: literatureIcon,
  English: englishIcon,
  Mathematics: mathematicsIcon,
  Polish: polishIcon,
};
