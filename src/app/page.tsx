// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Student {
  id: string;
  ID_Number: string;
  First_Name: string;
  Last_Name: string;
  Spiritual_Name: string;
  Phone_Number: string;
  Age: number;
  Sex: string;
  Class: string;
  Occupation: string;
  Education_Background: string;
  Address: string;
  Academic_Year: string;
}

interface Attendance {
  studentId: string;
  date: string; // Gregorian date (ISO string, YYYY-MM-DD)
  present: boolean;
  hasPermission: boolean;
}

export default function Home() {
  // Sample student data (replace with MongoDB later)
  const [students] = useState<Student[]>([
    {
      id: '1',
      ID_Number: '250001',
      First_Name: 'John',
      Last_Name: 'Doe',
      Spiritual_Name: 'Yohannes',
      Phone_Number: '0912345678',
      Age: 15,
      Sex: 'Male',
      Class: 'Grade 1',
      Occupation: 'Student',
      Education_Background: '9-12',
      Address: 'Addis Ababa',
      Academic_Year: '2025',
    },
    {
      id: '2',
      ID_Number: '250002',
      First_Name: 'Mary',
      Last_Name: 'Smith',
      Spiritual_Name: 'Kidist',
      Phone_Number: '0923456789',
      Age: 17,
      Sex: 'Female',
      Class: 'Grade 2',
      Occupation: 'Student',
      Education_Background: '9-12',
      Address: 'Addis Ababa',
      Academic_Year: '2025',
    },
    {
      id: '3',
      ID_Number: '250003',
      First_Name: 'ቢንያም',
      Last_Name: 'ታገል',
      Spiritual_Name: 'Yohannes',
      Phone_Number: '0912345678',
      Age: 15,
      Sex: 'Male',
      Class: 'Grade 1',
      Occupation: 'Student',
      Education_Background: '9-12',
      Address: 'Addis Ababa',
      Academic_Year: '2025',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate] = useState<string>('2025-06-08'); // Fixed to today
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isSunday, setIsSunday] = useState(false);

  // Check if today is Sunday
  useEffect(() => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    setIsSunday(dayOfWeek === 0);
  }, [selectedDate]);

  // Toggle attendance (uncheck permission if present is checked)
  const toggleAttendance = (studentId: string) => {
    if (!isSunday) {
      alert('Attendance can only be marked on Sundays');
      return;
    }
    const existingRecord = attendance.find(
      (rec) => rec.studentId === studentId && rec.date === selectedDate
    );
    if (existingRecord) {
      setAttendance(
        attendance.map((rec) =>
          rec.studentId === studentId && rec.date === selectedDate
            ? { ...rec, present: !rec.present, hasPermission: false }
            : rec
        )
      );
    } else {
      setAttendance([
        ...attendance,
        { studentId, date: selectedDate, present: true, hasPermission: false },
      ]);
    }
  };

  // Toggle permission (uncheck present if permission is checked)
  const togglePermission = (studentId: string) => {
    if (!isSunday) {
      alert('Permission can only be marked on Sundays');
      return;
    }
    const existingRecord = attendance.find(
      (rec) => rec.studentId === studentId && rec.date === selectedDate
    );
    if (existingRecord) {
      setAttendance(
        attendance.map((rec) =>
          rec.studentId === studentId && rec.date === selectedDate
            ? { ...rec, hasPermission: !rec.hasPermission, present: false }
            : rec
        )
      );
    } else {
      setAttendance([
        ...attendance,
        { studentId, date: selectedDate, present: false, hasPermission: true },
      ]);
    }
  };

  // Generate Excel file
  const generateExcelFile = () => {
    // Prepare data for Excel
    const data = students.map((student) => {
      const record = attendance.find(
        (rec) => rec.studentId === student.id && rec.date === selectedDate
      );
      let status = 'Absent';
      if (record) {
        status = record.present ? 'Present' : record.hasPermission ? 'Permission' : 'Absent';
      }
      return {
        ID_Number: student.ID_Number,
        First_Name: student.First_Name,
        Last_Name: student.Last_Name,
        Class: student.Class,
        Attendance_Status: status,
        Date: selectedDate,
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `Attendance_${selectedDate}.xlsx`;

    // Download file
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSunday) {
      alert('Attendance can only be submitted on Sundays');
      return;
    }
    const hasAttendance = attendance.some(
      (rec) => rec.date === selectedDate && (rec.present || rec.hasPermission)
    );
    if (!hasAttendance) {
      alert('Please mark at least one student as Present or with Permission');
      return;
    }
    console.log('Submitted Attendance:', attendance);
    alert('Attendance submitted successfully!');
    generateExcelFile();
    setAttendance([]);
  };

  // Get unique classes for filter
  const classOptions = [...new Set(students.map((student) => student.Class))];

  // Search and class filter
  const filteredStudents = students.filter(
    (student) =>
      (selectedClass === '' || student.Class === selectedClass) &&
      (student.ID_Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Management</h1>

      {/* Date Display and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Date
          </label>
          <p className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
            June 8, 2025
          </p>
          {!isSunday && (
            <p className="text-red-500 text-sm mt-1">
              Attendance can only be marked on Sundays.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Students
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by ID, Name, or Class"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Class Filter and Submit Button */}
      <form onSubmit={handleSubmit} className="mb-6 flex justify-between items-end">
        <div className="w-full md:w-1/2">
          <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Class
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit Attendance
        </button>
      </form>

      {/* Student List with Attendance */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left text-gray-700">ID Number</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Name</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Class</th>
              <th className="border border-gray-200 p-3 text-center text-gray-700">Present</th>
              <th className="border border-gray-200 p-3 text-center text-gray-700">Permission</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const attendanceRecord = attendance.find(
                (rec) => rec.studentId === student.id && rec.date === selectedDate
              );
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3">{student.ID_Number}</td>
                  <td className="border border-gray-200 p-3">{`${student.First_Name} ${student.Last_Name}`}</td>
                  <td className="border border-gray-200 p-3">{student.Class}</td>
                  <td className="border border-gray-200 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={attendanceRecord?.present || false}
                      onChange={() => toggleAttendance(student.id)}
                      disabled={!isSunday}
                      className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={attendanceRecord?.hasPermission || false}
                      onChange={() => togglePermission(student.id)}
                      disabled={!isSunday}
                      className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}