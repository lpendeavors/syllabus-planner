import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';
import { addDays, isSameDay } from 'date-fns';

export const exportPDF = (
  combinedLectureSchedule: any,
  combinedAssignments: any,
  combinedExams: any
) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(18);
  doc.text('Consolidated Schedule', 14, 22);

  const columns = ['Date', 'Type', 'Topic', 'Details', 'Course', 'Grade'];
  const combinedEvents: {
    date: Date;
    type: string;
    topic: string;
    course: string;
    details: string;
  }[] = [];

  combinedLectureSchedule.forEach((lecture: any) => {
    const readings = lecture.readings.join(', ');
    combinedEvents.push({
      date: new Date(lecture.date!),
      type: 'Lecture',
      topic: lecture.topic,
      course: lecture.courseName || '',
      details: readings,
    });
  });

  combinedAssignments.forEach((assignment: any) => {
    combinedEvents.push({
      date: new Date(assignment.date!),
      type: 'Assignment',
      topic: assignment.name,
      course: assignment.courseName || '',
      details: `Points: ${assignment.points}`,
    });
  });

  combinedExams.forEach((exam: any) => {
    combinedEvents.push({
      date: new Date(exam.date!),
      type: 'Exam',
      topic: exam.name,
      course: exam.courseName || '',
      details: `Points: ${exam.points}`,
    });
  });

  // Sort the events chronologically
  combinedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get the start and end dates
  const startDate = combinedEvents.length ? combinedEvents[0].date : new Date();
  const endDate = combinedEvents.length
    ? combinedEvents[combinedEvents.length - 1].date
    : new Date();

  // Generate rows for all dates between startDate and endDate, including weekends
  const rows = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const matchingEvents = combinedEvents.filter((event) =>
      isSameDay(event.date, currentDate)
    );

    if (matchingEvents.length > 0) {
      // Add rows for events that match the current date
      matchingEvents.forEach((event) => {
        rows.push([
          formatDate(event.date),
          event.type,
          event.topic,
          event.details,
          event.course,
          '', // Leave a blank space for Grades
        ]);
      });
    } else {
      // Add a blank row for the current date
      rows.push([
        formatDate(currentDate),
        '', // No event type
        '', // No topic
        '', // No course
        '', // No details
        '', // Blank space for Grades
      ]);
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 32,
    styles: {
      fontSize: 10,
      lineWidth: 0.5,
    },
    tableLineWidth: 0.5,
    tableLineColor: [0, 0, 0],
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 80 },
      3: { cellWidth: 50 },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 30 }, // Column for Grades
    },
    didDrawPage: (data) => {
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(
        '© 2024 StudyPlanner | www.studyplanner.com',
        data.settings.margin.left,
        pageHeight - 10
      );
    },
  });

  doc.save('study-schedule.pdf');
};
