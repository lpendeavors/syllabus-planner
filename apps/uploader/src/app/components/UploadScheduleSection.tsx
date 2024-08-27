import React, { useState, useEffect } from 'react';
import Schedule from './Schedule';
import { useUpload } from '../hooks/useUpload';
import { Course, LectureSchedule, Assignment, Exam } from '../models/Course';
import { onFilesChange } from '../utils/fileUpload';

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const courseColor = colors[Math.floor(Math.random() * colors.length)];

export default function UploadScheduleSection() {
  const [scheduleData, setScheduleData] = useState<Course[]>([]); // Array to hold multiple courses
  const { isLoading, isSuccess, error, handleUpload } = useUpload();

  // Load saved courses from localStorage when the component mounts
  useEffect(() => {
    const savedCourses = localStorage.getItem('uploadedCourses');
    if (savedCourses) {
      setScheduleData(JSON.parse(savedCourses));
    }
  }, []);

  // Handle delete
  const handleDelete = (
    itemId: string | number, // Using ID instead of index
    type: 'lecture' | 'assignment' | 'exam'
  ) => {
    if (!scheduleData) return;

    const updatedData = [...scheduleData];

    updatedData.forEach((course) => {
      if (type === 'lecture') {
        course.lectureSchedule = course.lectureSchedule.filter(
          (lecture) => lecture.id !== itemId
        );
      } else if (type === 'assignment') {
        course.keyDates.assignments = course.keyDates.assignments.filter(
          (assignment) => assignment.id !== itemId
        );
      } else if (type === 'exam') {
        course.keyDates.exams = course.keyDates.exams.filter(
          (exam) => exam.id !== itemId
        );
      }
    });

    // Update state and save to localStorage
    setScheduleData(updatedData);
    localStorage.setItem('uploadedCourses', JSON.stringify(updatedData));
  };

  // Handle edit
  const handleEdit = (
    itemId: string | number, // Using ID instead of index
    type: 'lecture' | 'assignment' | 'exam',
    updatedItem: LectureSchedule | Assignment | Exam
  ) => {
    if (!scheduleData) return;

    const updatedData = [...scheduleData];

    updatedData.forEach((course) => {
      if (type === 'lecture') {
        const index = course.lectureSchedule.findIndex(
          (lecture) => lecture.id === itemId
        );
        if (index !== -1)
          course.lectureSchedule[index] = updatedItem as LectureSchedule;
      } else if (type === 'assignment') {
        const index = course.keyDates.assignments.findIndex(
          (assignment) => assignment.id === itemId
        );
        if (index !== -1)
          course.keyDates.assignments[index] = updatedItem as Assignment;
      } else if (type === 'exam') {
        const index = course.keyDates.exams.findIndex(
          (exam) => exam.id === itemId
        );
        if (index !== -1) course.keyDates.exams[index] = updatedItem as Exam;
      }
    });

    // Update state and save to localStorage
    setScheduleData(updatedData);
    localStorage.setItem('uploadedCourses', JSON.stringify(updatedData));
  };

  // Clear the schedule with confirmation
  const clearSchedule = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your entire schedule? This action cannot be undone.'
    );
    if (confirmClear) {
      setScheduleData([]); // Clear the state
      localStorage.removeItem('uploadedCourses'); // Remove from localStorage
    }
  };

  return (
    <section id="upload" className="py-16 bg-white relative">
      {/* Blocking Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              Processing your file...
            </h2>
            <p className="text-white">
              Please wait while we process your syllabus.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Upload Your Syllabi
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Consolidate your study schedule effortlessly by uploading your
          syllabi.
        </p>

        {/* Upload Box */}
        <div className="mt-8 flex justify-center">
          <div className="max-w-lg w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="mb-4 text-gray-500">
              Drag and drop your files here, or click to upload.
            </p>
            <input
              type="file"
              multiple
              accept=".docx, .pdf, .jpg, .jpeg, .png, .gif"
              onChange={(e) =>
                onFilesChange(e, handleUpload, setScheduleData, scheduleData)
              } // Upload on file selection
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="mt-4 text-center">
          {isSuccess && (
            <p className="text-green-500">Files uploaded successfully!</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Schedule Display */}
        <Schedule
          data={scheduleData}
          courseColor={courseColor}
          onDelete={handleDelete} // Pass down the delete handler
          onEdit={handleEdit} // Pass down the edit handler
          onClear={clearSchedule} // Pass down the clear handler
        />
      </div>
    </section>
  );
}
