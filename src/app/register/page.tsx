// src/app/register/page.tsx
"use client";
import { useState } from "react";

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

export default function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [idCounter, setIdCounter] = useState<{ [year: string]: number }>({});
  const [newStudent, setNewStudent] = useState({
    First_Name: "",
    Last_Name: "",
    Spiritual_Name: "",
    Phone_Number: "",
    Age: 0,
    Sex: "",
    Class: "",
    Occupation: "",
    Education_Background: "",
    Address: "",
    Academic_Year: "",
  });

  const generateIDNumber = (academicYear: string) => {
    const yearLastTwoDigits = academicYear.slice(-2);
    const currentCount = idCounter[academicYear] || 0;
    const newCount = currentCount + 1;
    setIdCounter({ ...idCounter, [academicYear]: newCount });
    return `${yearLastTwoDigits}${newCount.toString().padStart(4, "0")}`;
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.Academic_Year.match(/^\d{4}$/)) {
      alert("Please enter a valid 4-digit Academic Year (e.g., 2025)");
      return;
    }
    const id = Math.random().toString(36).substr(2, 9); // Temporary random ID
    const ID_Number = generateIDNumber(newStudent.Academic_Year);
    const student = { ...newStudent, id, ID_Number };
    setStudents([...students, student]);
    setNewStudent({
      First_Name: "",
      Last_Name: "",
      Spiritual_Name: "",
      Phone_Number: "",
      Age: 0,
      Sex: "",
      Class: "",
      Occupation: "",
      Education_Background: "",
      Address: "",
      Academic_Year: "",
    });
  };

  const filteredStudents = students.filter(
    (student) =>
      student.ID_Number.includes(searchTerm) ||
      student.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Student Registration
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by ID, Name, or Class"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Add Student Form */}
      <form
        onSubmit={handleAddStudent}
        className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Student
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={newStudent.First_Name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, First_Name: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newStudent.Last_Name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Last_Name: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="text"
            placeholder="Spiritual Name"
            value={newStudent.Spiritual_Name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Spiritual_Name: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newStudent.Phone_Number}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Phone_Number: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            placeholder="Age"
            value={newStudent.Age || ""}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Age: parseInt(e.target.value) })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <select
            value={newStudent.Sex}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Sex: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            value={newStudent.Class}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Class: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">Select Class</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
          </select>
          <select
            value={newStudent.Occupation}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Occupation: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">Select Occupation</option>
            <option value="Student">Student</option>
            <option value="Worker">Worker</option>
          </select>
          <select
            value={newStudent.Education_Background}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                Education_Background: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">Select Education Background</option>
            <option value="1-8">1-8</option>
            <option value="9-12">9-12</option>
            <option value="University">University</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={newStudent.Address}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Address: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="Academic Year (e.g., 2025)"
            value={newStudent.Academic_Year}
            onChange={(e) =>
              setNewStudent({ ...newStudent, Academic_Year: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Student
        </button>
      </form>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left text-gray-700">
                ID Number
              </th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">
                Name
              </th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">
                Class
              </th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">
                Occupation
              </th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">
                Education
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3">
                  {student.ID_Number}
                </td>
                <td className="border border-gray-200 p-3">{`${student.First_Name} ${student.Last_Name}`}</td>
                <td className="border border-gray-200 p-3">{student.Class}</td>
                <td className="border border-gray-200 p-3">
                  {student.Occupation}
                </td>
                <td className="border border-gray-200 p-3">
                  {student.Education_Background}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
