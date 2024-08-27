export interface LectureSchedule {
  id?: string;
  date?: Date | string;
  topic: string;
  readings: string[];
}

export interface Exam {
  id?: string;
  name: string;
  date?: Date | string;
  coverage: string;
  points: number;
}

export interface Assignment {
  id?: string;
  name: string;
  date?: Date | string;
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
  dates: Date[] | string[];
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
