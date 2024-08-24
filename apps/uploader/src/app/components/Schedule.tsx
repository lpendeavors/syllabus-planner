import React, { useState, ChangeEvent } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

import { Course, LectureSchedule, Assignment, Exam } from '../models/Course';

interface ScheduleProps {
  data: Course | null;
  courseColor: string;
}

interface LectureEditFormProps {
  lecture: LectureSchedule;
  onSave: (updatedLecture: LectureSchedule) => void;
  onCancel: () => void;
}

interface AssignmentEditFormProps {
  assignment: Assignment;
  onSave: (updatedAssignment: Assignment) => void;
  onCancel: () => void;
}

interface ExamEditFormProps {
  exam: Exam;
  onSave: (updatedExam: Exam) => void;
  onCancel: () => void;
}

export default function Schedule({ data, courseColor }: ScheduleProps) {
  const [activeTab, setActiveTab] = useState('lectures');
  const [editItem, setEditItem] = useState<{
    index: number | null;
    type: string;
  }>({ index: null, type: '' });

  if (!data) {
    return (
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 text-center">
          Your Consolidated Schedule
        </h3>
        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 text-center">
            Once your files are processed, your schedule will appear here.
          </p>
        </div>
      </div>
    );
  }

  const { lectureSchedule, keyDates } = data;

  // Save data to localStorage after modification
  const saveDataToLocalStorage = (updatedData: Course) => {
    localStorage.setItem('uploadedCourses', JSON.stringify(updatedData));
  };

  // Delete function
  const handleDelete = (
    index: number,
    type: 'lecture' | 'assignment' | 'exam'
  ) => {
    let updatedData: Course;
    if (type === 'lecture') {
      const updatedLectures = [...lectureSchedule];
      updatedLectures.splice(index, 1);
      updatedData = { ...data, lectureSchedule: updatedLectures };
    } else if (type === 'assignment') {
      const updatedAssignments = [...keyDates.assignments];
      updatedAssignments.splice(index, 1);
      updatedData = {
        ...data,
        keyDates: { ...keyDates, assignments: updatedAssignments },
      };
    } else {
      const updatedExams = [...keyDates.exams];
      updatedExams.splice(index, 1);
      updatedData = { ...data, keyDates: { ...keyDates, exams: updatedExams } };
    }
    saveDataToLocalStorage(updatedData);
    setEditItem({ index: null, type: '' });
  };

  // Edit function
  const handleEdit = (
    index: number,
    type: 'lecture' | 'assignment' | 'exam',
    updatedItem: LectureSchedule | Assignment | Exam
  ) => {
    let updatedData: Course;
    if (type === 'lecture') {
      const updatedLectures = [...lectureSchedule];
      updatedLectures[index] = updatedItem as LectureSchedule;
      updatedData = { ...data, lectureSchedule: updatedLectures };
    } else if (type === 'assignment') {
      const updatedAssignments = [...keyDates.assignments];
      updatedAssignments[index] = updatedItem as Assignment;
      updatedData = {
        ...data,
        keyDates: { ...keyDates, assignments: updatedAssignments },
      };
    } else {
      const updatedExams = [...keyDates.exams];
      updatedExams[index] = updatedItem as Exam;
      updatedData = { ...data, keyDates: { ...keyDates, exams: updatedExams } };
    }
    saveDataToLocalStorage(updatedData);
    setEditItem({ index: null, type: '' }); // Exit edit mode
  };

  // Utility to get classNames properly for color
  const getTabClassNames = (tab: string) =>
    activeTab === tab
      ? `bg-${courseColor}-100 text-${courseColor}-700 rounded-md px-3 py-2 text-sm font-medium`
      : 'text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium';

  const exportPDF = () => {
    // Initialize the jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: 'landscape' });

    // Add title at the top of the page
    doc.setFontSize(18);
    doc.text('Consolidated Study Schedule', 14, 22);

    // Add some spacing between title and content
    doc.setFontSize(12);
    if (data) {
      // Column headers with an additional "Grade" column
      const columns = ['Date', 'Topic', 'Details', 'Grade'];
      const rows: string[][] = [];

      // Add lecture schedule data with an empty "Grade" column
      data.lectureSchedule.forEach((lecture) => {
        const readings = lecture.readings.join(', ');
        rows.push([lecture.date, lecture.topic, readings, '']);
      });

      // Add assignment data with an empty "Grade" column
      data.keyDates.assignments.forEach((assignment) => {
        rows.push([
          assignment.date,
          assignment.name,
          `Points: ${assignment.points}`,
          '',
        ]);
      });

      // Add exam data with an empty "Grade" column
      data.keyDates.exams.forEach((exam) => {
        rows.push([exam.date, exam.name, `Points: ${exam.points}`, '']);
      });

      // Generate the table with vertical borders and adjusted column widths
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 32,
        styles: {
          fontSize: 10, // Adjust general font size if needed
          lineWidth: 0.5, // Set line width for borders
        },
        tableLineWidth: 0.5, // Line width for the table
        tableLineColor: [0, 0, 0], // Black borders
        columnStyles: {
          0: { cellWidth: 30 }, // Date column
          1: { cellWidth: 100 }, // Topic column
          2: { cellWidth: 'auto' }, // Details column
          3: { cellWidth: 30 }, // Grade column (empty for manual entry)
        },
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(10);
          doc.text(
            '© 2024 StudyPlanner | www.studyplanner.com',
            data.settings.margin.left,
            pageHeight - 10
          ); // Footer branding on every page
        },
      });

      // Save the PDF
      doc.save('study-schedule.pdf');
    }
  };

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 text-center">
        Your Consolidated Schedule
      </h3>

      {/* Tabs Navigation */}
      <div className="mt-6">
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('lectures')}
              className={getTabClassNames('lectures')}
            >
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={getTabClassNames('assignments')}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={getTabClassNames('exams')}
            >
              Exams
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Lectures
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {lectureSchedule.map((lecture, index) => (
                <li key={index} className="py-4">
                  {editItem.index === index && editItem.type === 'lecture' ? (
                    <LectureEditForm
                      lecture={lecture}
                      onSave={(updatedLecture: LectureSchedule) =>
                        handleEdit(index, 'lecture', updatedLecture)
                      }
                      onCancel={() => setEditItem({ index: null, type: '' })}
                    />
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="max-w-xl">
                        <h3 className="break-words text-sm font-semibold text-gray-900">
                          {lecture.date}: {lecture.topic}
                        </h3>
                        {lecture.readings.length > 0 && (
                          <p className="mt-1 break-words text-sm text-gray-500">
                            Readings: {lecture.readings.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setEditItem({ index, type: 'lecture' })
                          }
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index, 'lecture')}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Assignments
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {keyDates.assignments.map((assignment, index) => (
                <li key={index} className="py-4">
                  {editItem.index === index &&
                  editItem.type === 'assignment' ? (
                    <AssignmentEditForm
                      assignment={assignment}
                      onSave={(updatedAssignment: Assignment) =>
                        handleEdit(index, 'assignment', updatedAssignment)
                      }
                      onCancel={() => setEditItem({ index: null, type: '' })}
                    />
                  ) : (
                    <div className="flex justify-between">
                      <div>
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {assignment.date}: {assignment.name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          Points: {assignment.points}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setEditItem({ index, type: 'assignment' })
                          }
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index, 'assignment')}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Exams
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {keyDates.exams.map((exam, index) => (
                <li key={index} className="py-4">
                  {editItem.index === index && editItem.type === 'exam' ? (
                    <ExamEditForm
                      exam={exam}
                      onSave={(updatedExam: Exam) =>
                        handleEdit(index, 'exam', updatedExam)
                      }
                      onCancel={() => setEditItem({ index: null, type: '' })}
                    />
                  ) : (
                    <div className="flex justify-between">
                      <div>
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {exam.date}: {exam.name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          Points: {exam.points}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditItem({ index, type: 'exam' })}
                          className="text-sm text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index, 'exam')}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <button
          className={`bg-${courseColor}-500 hover:bg-${courseColor}-700 text-white font-bold py-2 px-4 rounded`}
          onClick={exportPDF}
        >
          Export Schedule
        </button>
      </div>
    </div>
  );
}

function LectureEditForm({ lecture, onSave, onCancel }: LectureEditFormProps) {
  const [formData, setFormData] = useState<LectureSchedule>({ ...lecture });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Date"
      />
      <input
        name="topic"
        value={formData.topic}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Topic"
      />
      <input
        name="readings"
        value={formData.readings.join(', ')}
        onChange={(e) =>
          setFormData({ ...formData, readings: e.target.value.split(', ') })
        }
        className="border rounded-md px-2 py-1"
        placeholder="Readings"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(formData)}
          className="text-sm text-green-500 hover:text-green-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AssignmentEditForm({
  assignment,
  onSave,
  onCancel,
}: AssignmentEditFormProps) {
  const [formData, setFormData] = useState<Assignment>({ ...assignment });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Date"
      />
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Assignment Name"
      />
      <input
        name="points"
        value={formData.points}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Points"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(formData)}
          className="text-sm text-green-500 hover:text-green-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ExamEditForm({ exam, onSave, onCancel }: ExamEditFormProps) {
  const [formData, setFormData] = useState<Exam>({ ...exam });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Date"
      />
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Exam Name"
      />
      <input
        name="points"
        value={formData.points}
        onChange={handleChange}
        className="border rounded-md px-2 py-1"
        placeholder="Points"
      />
      <div className="flex space-x-2">
        <button
          onClick={() => onSave(formData)}
          className="text-sm text-green-500 hover:text-green-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
