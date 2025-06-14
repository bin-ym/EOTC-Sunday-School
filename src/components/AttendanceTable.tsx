// src/components/AttendanceTable.tsx
import { Student, Attendance } from "../lib/imports";

interface AttendanceTableProps {
  students: Student[] | null;
  attendance: Attendance[];
  selectedDate: string;
  isSunday: boolean;
  toggleAttendance: (studentId: string) => void;
  togglePermission: (studentId: string) => void;
}

interface Student {
  _id: string;
  Unique_ID: string;
  First_Name: string;
  Father_Name: string;
  Grandfather_Name: string;
  Mothers_Name: string;
  Christian_Name: string;
  DOB_Date: string;
  DOB_Month: string;
  DOB_Year: string;
  Age: number;
  Sex: string;
  Phone_Number: string;
  Class: string;
  Occupation: string;
  School?: string;
  Educational_Background?: string;
  Place_of_Work?: string;
  Address: string;
  Academic_Year: string;
  Grade: string;
}

interface Attendance {
  studentId: string;
  date: string;
  present: boolean;
  hasPermission: boolean;
}

export default function AttendanceTable({
  students,
  attendance,
  selectedDate,
  isSunday,
  toggleAttendance,
  togglePermission,
}: AttendanceTableProps) {
  if (!students || students.length === 0) {
    return <p>No students available</p>;
  }

  const toggleAbsent = (studentId: string) => {
    if (!isSunday) return alert("Attendance can only be marked on Sundays");
    const record = attendance.find(
      (r) => r.studentId === studentId && r.date === selectedDate
    );
    if (record) {
      // Clear both present and hasPermission to mark as absent
      toggleAttendance(studentId); // Uncheck present
      if (record.hasPermission) togglePermission(studentId); // Uncheck permission
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left text-gray-700">ID Number</th>
            <th className="border p-3 text-left text-gray-700">Name</th>
            <th className="border p-3 text-left text-gray-700">Grade</th>
            <th className="border p-3 text-center text-gray-700">Present</th>
            <th className="border p-3 text-center text-gray-700">Permission</th>
            <th className="border p-3 text-center text-gray-700">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const record = attendance.find(
              (r) => r.studentId === student._id && r.date === selectedDate
            );
            const isAbsent = !record?.present && !record?.hasPermission;
            return (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="border p-3">{student.Unique_ID}</td>
                <td className="border p-3">{`${student.First_Name} ${student.Father_Name}`}</td>
                <td className="border p-3">{student.Grade}</td>
                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={record?.present || false}
                    onChange={() => toggleAttendance(student._id)}
                    disabled={!isSunday}
                    className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={record?.hasPermission || false}
                    onChange={() => togglePermission(student._id)}
                    disabled={!isSunday}
                    className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td className="border p-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAbsent}
                    onChange={() => toggleAbsent(student._id)}
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
  );
}