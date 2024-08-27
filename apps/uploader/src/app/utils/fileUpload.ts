import { Course } from '../models/Course';
import { v4 as uuidv4 } from 'uuid';

export const onFilesChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  handleUpload: (files: FileList) => Promise<any>,
  setScheduleData: React.Dispatch<React.SetStateAction<Course[]>>,
  scheduleData: Course[]
) => {
  const files = e.target.files;
  if (files) {
    const newSchedule = await handleUpload(files); // Upload and get new syllabus data

    if (!newSchedule) {
      console.error('Failed to upload and retrieve the new schedule');
      return; // Stop the function if the upload fails
    }

    const isValidDate = (dateString: string | Date | undefined | null) => {
      const date = new Date(dateString || '');
      return !isNaN(date.getTime()); // Check if the date is valid
    };

    // Function to parse and assign unique IDs to each lecture, assignment, and exam
    const parseScheduleDates = (schedule: any): Course => {
      return {
        courseTitle: schedule.courseTitle || 'Untitled Course',
        courseSubject: schedule.courseSubject || '',
        courseNumber: schedule.courseNumber || '',
        instructor: schedule.instructor || '',
        description: schedule.description || '',
        gradingBreakdown: schedule.gradingBreakdown || [],
        lectureSchedule: schedule.lectureSchedule.map(
          (lecture: { date: string | Date; [key: string]: any }) => ({
            ...lecture,
            id: uuidv4(), // Assign unique ID
            date: isValidDate(lecture.date) ? new Date(lecture.date) : null, // Validate and parse date
          })
        ),
        keyDates: {
          exams: schedule.keyDates.exams.map(
            (exam: { date: string | Date; [key: string]: any }) => ({
              ...exam,
              id: uuidv4(), // Assign unique ID
              date: isValidDate(exam.date) ? new Date(exam.date) : null, // Validate and parse date
            })
          ),
          assignments: schedule.keyDates.assignments.map(
            (assignment: { date: string | Date; [key: string]: any }) => ({
              ...assignment,
              id: uuidv4(), // Assign unique ID
              date: isValidDate(assignment.date)
                ? new Date(assignment.date)
                : null, // Validate and parse date
            })
          ),
        },
      };
    };

    setScheduleData((prevData: Course[]) => {
      const parsedNewSchedule = parseScheduleDates(newSchedule);
      const updatedSchedule = [...prevData, parsedNewSchedule];

      // Sort all lecture, assignment, and exam schedules directly
      const sortedUpdatedSchedule = updatedSchedule.map((course) => ({
        ...course,
        lectureSchedule: course.lectureSchedule.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date.getTime() : 0;
          const dateB = b.date instanceof Date ? b.date.getTime() : 0;
          if (!dateA && !dateB) return 0;
          if (!dateA) return -1;
          if (!dateB) return 1;
          return dateA - dateB;
        }),
        keyDates: {
          assignments: course.keyDates.assignments.sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date.getTime() : 0;
            const dateB = b.date instanceof Date ? b.date.getTime() : 0;
            if (!dateA && !dateB) return 0;
            if (!dateA) return -1;
            if (!dateB) return 1;
            return dateA - dateB;
          }),
          exams: course.keyDates.exams.sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date.getTime() : 0;
            const dateB = b.date instanceof Date ? b.date.getTime() : 0;
            if (!dateA && !dateB) return 0;
            if (!dateA) return -1;
            if (!dateB) return 1;
            return dateA - dateB;
          }),
        },
      }));

      // Save the sorted schedule to localStorage
      localStorage.setItem(
        'uploadedCourses',
        JSON.stringify(sortedUpdatedSchedule)
      );

      // Return the sorted and updated schedule data
      return sortedUpdatedSchedule;
    });
  }
};
