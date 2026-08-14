export const TIME_PERIODS = [
  { value: "morning", id: 1 },
  { value: "afternoon", id: 2 },
  { value: "evening", id: 3 },
] as const;

export type TimePeriod = typeof TIME_PERIODS[number]["value"];
