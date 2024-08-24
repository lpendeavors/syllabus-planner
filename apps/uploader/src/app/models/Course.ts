export interface LectureSchedule {
  date: string;
  topic: string;
  readings: string[];
}

export interface Exam {
  name: string;
  date: string;
  coverage: string;
  points: number;
}

export interface Assignment {
  name: string;
  date: string;
  points: number;
}

export interface KeyDates {
  exams: Exam[];
  assignments: Assignment[];
}

export interface GradingBreakdown {
  component: string;
  points: number;
  percentage: number;
  dates: string[];
}

export interface Course {
  courseTitle: string;
  courseSubject: string;
  courseNumber: string;
  instructor: string;
  description: string;
  lectureSchedule: LectureSchedule[];
  keyDates: KeyDates;
  gradingBreakdown: GradingBreakdown[];
}
