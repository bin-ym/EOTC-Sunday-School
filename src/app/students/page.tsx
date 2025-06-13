// src/app/students/page.tsx
'use client';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

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

export default function Students() {
  // Sample student data (simulating Excel import, replace with MongoDB later)
  const [students, setStudents] = useState<Student[]>([
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
  const [selectedSex, setSelectedSex] = useState('');
  const [sortBy, setSortBy] = useState('ID_Number');
  const [idCounter, setIdCounter] = useState<{ [year: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expected headers from register/page.tsx
  const expectedHeaders = [
    'First_Name',
    'Last_Name',
    'Spiritual_Name',
    'Phone_Number',
    'Age',
    'Sex',
    'Class',
    'Occupation',
    'Education_Background',
    'Address',
    'Academic_Year',
  ];

  // Generate ID Number
  const generateIDNumber = (academicYear: string) => {
    const yearLastTwoDigits = academicYear.slice(-2);
    const currentCount = idCounter[academicYear] || 1000; // Start at 1000 to avoid conflict
    const newCount = currentCount + 1;
    setIdCounter({ ...idCounter, [academicYear]: newCount });
    return `${yearLastTwoDigits}${newCount.toString().padStart(4, '0')}`;
  };

  // Handle Excel import
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Validate headers
      const headers = jsonData[0] as string[];
      if (!headers.every((header, i) => header === expectedHeaders[i])) {
        alert(`Invalid Excel file format. Expected headers: ${expectedHeaders.join(', ')}`);
        return;
      }

      // Process rows (skip header)
      const newStudents: Student[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const academicYear = row[10]?.toString() || '';
        if (!academicYear.match(/^\d{4}$/)) {
          alert(`Invalid Academic Year in row ${i + 1}: ${academicYear}`);
          continue;
        }

        const student: Student = {
          id: Math.random().toString(36).substr(2, 9), // Temporary random ID
          ID_Number: generateIDNumber(academicYear),
          First_Name: row[0]?.toString() || '',
          Last_Name: row[1]?.toString() || '',
          Spiritual_Name: row[2]?.toString() || '',
          Phone_Number: row[3]?.toString() || '',
          Age: parseInt(row[4]) || 0,
          Sex: row[5]?.toString() || '',
          Class: row[6]?.toString() || '',
          Occupation: row[7]?.toString() || '',
          Education_Background: row[8]?.toString() || '',
          Address: row[9]?.toString() || '',
          Academic_Year: academicYear,
        };

        // Basic validation
        if (
          !student.First_Name ||
          !student.Last_Name ||
          !student.Sex ||
          !student.Class ||
          !student.Occupation ||
          !student.Education_Background
        ) {
          alert(`Missing required fields in row ${i + 1}`);
          continue;
        }

        newStudents.push(student);
      }

      if (newStudents.length > 0) {
        setStudents([...students, ...newStudents]);
        alert(`${newStudents.length} students imported successfully!`);
      } else {
        alert('No valid students found in the Excel file.');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Get unique filter options
  const classOptions = [...new Set(students.map((student) => student.Class))];
  const sexOptions = [...new Set(students.map((student) => student.Sex))];

  // Filter and sort students
  const filteredStudents = students
    .filter(
      (student) =>
        (selectedClass === '' || student.Class === selectedClass) &&
        (selectedSex === '' || student.Sex === selectedSex) &&
        (student.ID_Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.Class.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'ID_Number') {
        return a.ID_Number.localeCompare(b.ID_Number);
      } else {
        return `${a.First_Name} ${a.Last_Name}`.localeCompare(
          `${b.First_Name} ${b.Last_Name}`
        );
      }
    });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Records</h1>

      {/* Import Excel Button */}
      <div className="mb-6">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelImport}
          className="hidden"
          ref={fileInputRef}
          id="excelImport"
        />
        <label
          htmlFor="excelImport"
          className="inline-block bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Import Excel
        </label>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ID_Number">ID Number</option>
            <option value="Name">Name</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
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
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sexFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Sex
          </label>
          <select
            id="sexFilter"
            value={selectedSex}
            onChange={(e) => setSelectedSex(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sexes</option>
            {sexOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-3 text-left text-gray-700">ID Number</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Name</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Class</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Sex</th>
              <th className="border border-gray-200 p-3 text-left text-gray-700">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3">{student.ID_Number}</td>
                <td className="border border-gray-200 p-3">{`${student.First_Name} ${student.Last_Name}`}</td>
                <td className="border border-gray-200 p-3">{student.Class}</td>
                <td className="border border-gray-200 p-3">{student.Sex}</td>
                <td className="border border-gray-200 p-3 text-center">
                  <Link
                    href={`/students/${student.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}