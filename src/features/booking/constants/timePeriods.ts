export const TIME_PERIODS = [
  { value: "morning", label: "Morning", id: 1 },
  { value: "afternoon", label: "Afternoon", id: 2 },
  { value: "evening", label: "Evening", id: 3 },
] as const;

export type TimePeriod = typeof TIME_PERIODS[number]["value"];
