import type { SubjectFilterType } from "../../../types/SubjectFilterType";

type MockSubjectsType = {
  id: number;
  name: SubjectFilterType;
  description: string;
}

export const mockSubjects: MockSubjectsType[] = [
  {
    id: 1,
    name: "Chemistry",
    description: "Basic Chemistry",
  },
  {
    id: 2,
    name: "Ukrainian",
    description: "Ukrainian",
  },
  {
    id: 3,
    name: "Physics",
    description: "Basic Physics",
  },

  {
    id: 4,
    name: "Biology",
    description: "Basic Biology",
  },

  {
    id: 5,
    name: "History",
    description: "History",
  },

  {
    id: 6,
    name: "Literature",
    description: "Literature",
  },

  {
    id: 7,
    name: "English",
    description: "Basic English",
  },

  {
    id: 8,
    name: "Mathematics",
    description: "Basic Mathematics",
  },
];
