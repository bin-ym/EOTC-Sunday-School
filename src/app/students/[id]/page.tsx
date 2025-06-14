// src/app/students/[id]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  School_Other?: string;
  Educational_Background?: string;
  Place_of_Work?: string;
  Address: string;
  Address_Other?: string;
  Academic_Year: string;
  Grade: string;
}

export default function StudentDetails() {
  const { status } = useSession();
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
    } else if (status === "authenticated") {
      fetch(`/api/students/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log('Fetched student:', data); // Debugging
          setStudent(data);
        })
        .catch((error) => {
          console.error('Fetch student error:', error); // Debugging
          setStudent(null);
        });
    }
  }, [id, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!student) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Student Not Found
        </h1>
        <p className="text-gray-600 mb-4">No student found with ID: {id}</p>
        <Link
          href="/students"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
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
        <table className="min-w-full border-collapse border">
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">ID Number</td>
              <td className="border p-3">{student.Unique_ID}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">First Name</td>
              <td className="border p-3">{student.First_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Father Name</td>
              <td className="border p-3">{student.Father_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Grandfather Name</td>
              <td className="border p-3">{student.Grandfather_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Mother's Name</td>
              <td className="border p-3">{student.Mothers_Name}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Christian Name</td>
              <td className="border p-3">{student.Christian_Name || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Date of Birth (EC)</td>
              <td className="border p-3">{`${student.DOB_Date}/${student.DOB_Month}/${student.DOB_Year}`}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Age</td>
              <td className="border p-3">{student.Age}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Sex</td>
              <td className="border p-3">{student.Sex}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Phone Number</td>
              <td className="border p-3">{student.Phone_Number || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Class (World School)</td>
              <td className="border p-3">{student.Class || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Grade (Sunday School)</td>
              <td className="border p-3">{student.Grade}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Occupation</td>
              <td className="border p-3">{student.Occupation}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">School</td>
              <td className="border p-3">{student.School || student.School_Other || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Educational Background</td>
              <td className="border p-3">{student.Educational_Background || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Place of Work</td>
              <td className="border p-3">{student.Place_of_Work || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Address</td>
              <td className="border p-3">{student.Address || student.Address_Other || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border p-3 font-medium">Academic Year</td>
              <td className="border p-3">{student.Academic_Year}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link
        href="/students"
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Back to Students
      </Link>
    </div>
  );
}