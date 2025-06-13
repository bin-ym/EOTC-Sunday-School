// src/app/students/[id]/page.tsx
'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();

  // Sample student data (same as students/page.tsx, replace with MongoDB later)
  const students: Student[] = [
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
  ];

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Not Found</h1>
        <p className="text-gray-600 mb-4">No student found with ID: {id}</p>
        <Link
          href="/students"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Details</h1>
      <div className="mb-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">ID Number</td>
              <td className="border border-gray-200 p-3">{student.ID_Number}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">First Name</td>
              <td className="border border-gray-200 p-3">{student.First_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Last Name</td>
              <td className="border border-gray-200 p-3">{student.Last_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Spiritual Name</td>
              <td className="border border-gray-200 p-3">{student.Spiritual_Name || '-'}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Phone Number</td>
              <td className="border border-gray-200 p-3">{student.Phone_Number || '-'}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Age</td>
              <td className="border border-gray-200 p-3">{student.Age}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Sex</td>
              <td className="border border-gray-200 p-3">{student.Sex}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Class</td>
              <td className="border border-gray-200 p-3">{student.Class}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Occupation</td>
              <td className="border border-gray-200 p-3">{student.Occupation}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Education Background</td>
              <td className="border border-gray-200 p-3">{student.Education_Background}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Address</td>
              <td className="border border-gray-200 p-3">{student.Address || '-'}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 p-3 font-medium text-gray-700">Academic Year</td>
              <td className="border border-gray-200 p-3">{student.Academic_Year}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link
        href="/students"
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Back to Students
      </Link>
    </div>
  );
}