import React, { useState, useEffect } from 'react';
import Schedule from './Schedule';
import { useUpload } from '../hooks/useUpload';
import { Course } from '../models/Course';

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const courseColor = colors[Math.floor(Math.random() * colors.length)];

export default function UploadScheduleSection() {
  const [scheduleData, setScheduleData] = useState<Course | null>(null);
  const { isLoading, isSuccess, error, handleUpload } = useUpload();

  // Load saved courses from localStorage when the component mounts
  useEffect(() => {
    const savedCourses = localStorage.getItem('uploadedCourses');
    if (savedCourses) {
      setScheduleData(JSON.parse(savedCourses));
    }
  }, []);

  // Handle file selection and upload
  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newSchedule = await handleUpload(files); // Upload and get new syllabus data

      // Update scheduleData incrementally
      setScheduleData((prevData) => {
        const updatedSchedule = prevData
          ? {
              ...prevData,
              lectureSchedule: [
                ...prevData.lectureSchedule,
                ...newSchedule.lectureSchedule,
              ],
              keyDates: {
                exams: [
                  ...prevData.keyDates.exams,
                  ...newSchedule.keyDates.exams,
                ],
                assignments: [
                  ...prevData.keyDates.assignments,
                  ...newSchedule.keyDates.assignments,
                ],
              },
            }
          : newSchedule;

        // Save updated schedule to localStorage
        localStorage.setItem(
          'uploadedCourses',
          JSON.stringify(updatedSchedule)
        );

        return updatedSchedule;
      });
    }
  };

  return (
    <section className="py-16 bg-white">
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
              accept=".docx, .pdf"
              onChange={onFilesChange} // Upload on file selection
              className="hidden"
              id="file-upload"
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
          {isLoading && (
            <p className="text-gray-500">
              Processing your files, please wait...
            </p>
          )}
          {isSuccess && (
            <p className="text-green-500">Files uploaded successfully!</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Schedule Display */}
        <Schedule data={scheduleData} courseColor={courseColor} />
      </div>
    </section>
  );
}
