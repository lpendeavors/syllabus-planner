import React, { useState } from 'react';
import { Course, LectureSchedule, Assignment, Exam } from '../models/Course';
import { formatDate } from '../utils/formatDate';
import { exportPDF } from '../utils/exportPdf';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ScheduleProps {
  data: Course[];
  courseColor: string;
  onDelete: (
    itemId: string | number,
    type: 'lecture' | 'assignment' | 'exam'
  ) => void;
  onEdit: (
    itemId: string | number,
    type: 'lecture' | 'assignment' | 'exam',
    updatedItem: LectureSchedule | Assignment | Exam
  ) => void;
  onClear: () => void;
}

export default function Schedule({
  data = [],
  courseColor,
  onDelete,
  onEdit,
  onClear,
}: ScheduleProps) {
  const [activeTab, setActiveTab] = useState('lectures');
  const [editItem, setEditItem] = useState<{
    itemId: string | number | null;
    type: string;
  }>({ itemId: null, type: '' });
  const [formData, setFormData] = useState<any>({});

  const handleEditSave = () => {
    if (!editItem.itemId) return;
    onEdit(
      editItem.itemId,
      editItem.type as 'lecture' | 'assignment' | 'exam',
      formData
    );
    setEditItem({ itemId: null, type: '' });
    setFormData({});
  };

  const combinedLectureSchedule = data
    .reduce(
      (acc, course) =>
        acc.concat(
          course.lectureSchedule.map((lecture) => ({
            ...lecture,
            courseName: course.courseTitle,
          }))
        ),
      [] as (LectureSchedule & { courseName: string })[]
    )
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return -1;
      if (!b.date) return 1;
      return new Date(a.date!).getTime() - new Date(b.date!).getTime();
    });

  const combinedAssignments = data
    .reduce(
      (acc, course) =>
        acc.concat(
          course.keyDates.assignments.map((assignment) => ({
            ...assignment,
            courseName: course.courseTitle,
          }))
        ),
      [] as (Assignment & { courseName: string })[]
    )
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return -1;
      if (!b.date) return 1;
      return new Date(a.date!).getTime() - new Date(b.date!).getTime();
    });

  const combinedExams = data
    .reduce(
      (acc, course) =>
        acc.concat(
          course.keyDates.exams.map((exam) => ({
            ...exam,
            courseName: course.courseTitle,
          }))
        ),
      [] as (Exam & { courseName: string })[]
    )
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return -1;
      if (!b.date) return 1;
      return new Date(a.date!).getTime() - new Date(b.date!).getTime();
    });

  const getTabClassNames = (tab: string) =>
    activeTab === tab
      ? `bg-${courseColor}-100 text-${courseColor}-700 rounded-md px-3 py-2 text-sm font-medium`
      : 'text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium';

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
        {/* Lectures */}
        {activeTab === 'lectures' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Lectures
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {combinedLectureSchedule.map((lecture) => (
                <li key={lecture.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="max-w-xl">
                      <h3 className="break-words text-sm font-semibold text-gray-900">
                        {formatDate(lecture.date)}: {lecture.topic}
                      </h3>
                      {lecture.readings.length > 0 && (
                        <p className="mt-1 break-words text-sm text-gray-500">
                          Readings: {lecture.readings.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditItem({ itemId: lecture.id!, type: 'lecture' });
                          setFormData(lecture);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(lecture.id!, 'lecture')}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editItem.itemId === lecture.id &&
                    editItem.type === 'lecture' && (
                      <div className="mt-4 space-y-4">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={formData.topic || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, topic: e.target.value })
                          }
                          placeholder="Lecture Topic"
                        />
                        <DatePicker
                          className="border rounded px-2 py-1 w-full"
                          selected={
                            formData.date ? new Date(formData.date) : null
                          }
                          onChange={(date) =>
                            setFormData({
                              ...formData,
                              date: date ? date.toISOString() : '',
                            })
                          }
                          placeholderText="Select Date and Time"
                          showTimeSelect
                          dateFormat="Pp"
                          timeIntervals={15}
                        />
                        <textarea
                          className="border rounded px-2 py-1 w-full"
                          value={formData.readings?.join(', ') || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              readings: e.target.value
                                .split(',')
                                .map((s) => s.trim()),
                            })
                          }
                          placeholder="Readings (comma-separated)"
                        />
                        <div className="flex space-x-4">
                          <button
                            onClick={handleEditSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditItem({ itemId: null, type: '' })
                            }
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Assignments
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {combinedAssignments.map((assignment) => (
                <li key={assignment.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {formatDate(assignment.date)}: {assignment.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        Points: {assignment.points}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditItem({
                            itemId: assignment.id!,
                            type: 'assignment',
                          });
                          setFormData(assignment);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(assignment.id!, 'assignment')}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editItem.itemId === assignment.id &&
                    editItem.type === 'assignment' && (
                      <div className="mt-4 space-y-4">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={formData.name || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Assignment Name"
                        />
                        <DatePicker
                          className="border rounded px-2 py-1 w-full"
                          selected={
                            formData.date ? new Date(formData.date) : null
                          }
                          onChange={(date) =>
                            setFormData({
                              ...formData,
                              date: date ? date.toISOString() : '',
                            })
                          }
                          placeholderText="Select Date and Time"
                          showTimeSelect
                          dateFormat="Pp"
                          timeIntervals={15}
                        />
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={formData.points || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              points: e.target.value,
                            })
                          }
                          placeholder="Points"
                        />
                        <div className="flex space-x-4">
                          <button
                            onClick={handleEditSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditItem({ itemId: null, type: '' })
                            }
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exams */}
        {activeTab === 'exams' && (
          <div>
            <h4 className={`text-lg font-bold mb-4 text-${courseColor}-700`}>
              Exams
            </h4>
            <ul role="list" className="divide-y divide-gray-100">
              {combinedExams.map((exam) => (
                <li key={exam.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {formatDate(exam.date)}: {exam.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        Points: {exam.points}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditItem({ itemId: exam.id!, type: 'exam' });
                          setFormData(exam);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(exam.id!, 'exam')}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editItem.itemId === exam.id && editItem.type === 'exam' && (
                    <div className="mt-4 space-y-4">
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={formData.name || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Exam Name"
                      />
                      <DatePicker
                        className="border rounded px-2 py-1 w-full"
                        selected={
                          formData.date ? new Date(formData.date) : null
                        }
                        onChange={(date) =>
                          setFormData({
                            ...formData,
                            date: date ? date.toISOString() : '',
                          })
                        }
                        placeholderText="Select Date and Time"
                        showTimeSelect
                        dateFormat="Pp"
                        timeIntervals={15}
                      />
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={formData.points || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            points: e.target.value,
                          })
                        }
                        placeholder="Points"
                      />
                      <div className="flex space-x-4">
                        <button
                          onClick={handleEditSave}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() =>
                            setEditItem({ itemId: null, type: '' })
                          }
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
                        >
                          Cancel
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

      <div className="mt-8 flex justify-center space-x-4">
        {data.length > 0 && (
          <button
            onClick={onClear}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear Schedule
          </button>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() =>
            exportPDF(
              combinedLectureSchedule,
              combinedAssignments,
              combinedExams
            )
          }
        >
          Export Schedule
        </button>
      </div>
    </div>
  );
}
