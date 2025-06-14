// src/app/students/page.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

interface Student {
  _id: string;
  Unique_ID: string;
  First_Name: string;
  Father_Name: string;
  Grandfather_Name: string;
  Mothers_Name: string;
  Christian_Name: string;
  Phone_Number: string;
  Age: number;
  Sex: string;
  Class: string;
  Occupation: string;
  Educational_Background?: string;
  Address: string;
  Academic_Year: string;
  Grade: string;
}

export default function Students() {
  const { status } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSex, setSelectedSex] = useState("");
  const [sortBy, setSortBy] = useState("Unique_ID");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
    } else if (status === "authenticated") {
      fetch("/api/students")
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched students:', data); // Debugging
          setStudents(data);
        })
        .catch((error) => {
          console.error('Fetch students error:', error); // Debugging
          setStudents([]);
        });
    }
  }, [status]);

  const expectedHeaders = [
    "First_Name",
    "Father_Name",
    "Grandfather_Name",
    "Mothers_Name",
    "Christian_Name",
    "Phone_Number",
    "Age",
    "Sex",
    "Class",
    "Occupation",
    "Educational_Background",
    "Address",
    "Academic_Year",
    "Grade",
  ];

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.match(/\.xlsx?$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (
        !(
          Array.isArray(jsonData[0]) &&
          (jsonData[0] as unknown[]).every(
            (header, i) => header === expectedHeaders[i]
          )
        )
      ) {
        alert(
          `Invalid Excel format. Expected headers: ${expectedHeaders.join(", ")}`
        );
        return;
      }
      const newStudents: Student[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as (string | number | undefined)[];
        if (!row[12]?.toString().match(/^\d{4}$/)) {
          alert(`Invalid Academic Year in row ${i + 1}: ${row[12]}`);
          continue;
        }
        const student = {
          First_Name: row[0]?.toString() || "",
          Father_Name: row[1]?.toString() || "",
          Grandfather_Name: row[2]?.toString() || "",
          Mothers_Name: row[3]?.toString() || "",
          Christian_Name: row[4]?.toString() || "",
          Phone_Number: row[5]?.toString() || "",
          Age: parseInt(row[6] as string) || 0,
          Sex: row[7]?.toString() || "",
          Class: row[8]?.toString() || "",
          Occupation: row[9]?.toString() || "",
          Educational_Background: row[10]?.toString() || "",
          Address: row[11]?.toString() || "",
          Academic_Year: row[12]?.toString() || "",
          Grade: row[13]?.toString() || "",
        };
        if (
          !student.First_Name ||
          !student.Father_Name ||
          !student.Sex ||
          !student.Occupation ||
          !student.Address ||
          !student.Academic_Year ||
          !student.Grade
        ) {
          alert(`Missing required fields in row ${i + 1}`);
          continue;
        }
        try {
          const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
          });
          if (!res.ok) throw new Error(await res.text());
          const addedStudent = await res.json();
          newStudents.push(addedStudent);
        } catch (error) {
          console.error('Excel import error:', error); // Debugging
          alert(`Failed to add student in row ${i + 1}`);
        }
      }
      if (newStudents.length > 0) {
        setStudents([...students, ...newStudents]);
        alert(`${newStudents.length} students imported successfully!`);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredStudents = students
    .filter(
      (student) =>
        (selectedClass === "" || student.Class === selectedClass) &&
        (selectedSex === "" || student.Sex === selectedSex) &&
        (student.Unique_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.Father_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.Class.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === "Unique_ID"
        ? a.Unique_ID.localeCompare(b.Unique_ID)
        : `${a.First_Name} ${a.Father_Name}`.localeCompare(
            `${b.First_Name} ${b.Father_Name}`
          )
    );

  const classOptions = [...new Set(students.map((s) => s.Class))];
  const sexOptions = [...new Set(students.map((s) => s.Sex))];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Records</h1>
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
          className="inline-block bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Import Excel
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by ID, Name, or Class"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label
            htmlFor="sortBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="Unique_ID">ID Number</option>
            <option value="Name">Name</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="classFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Class
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-3 border rounded-lg"
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
          <label
            htmlFor="sexFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Sex
          </label>
          <select
            id="sexFilter"
            value={selectedSex}
            onChange={(e) => setSelectedSex(e.target.value)}
            className="w-full p-3 border rounded-lg"
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
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID Number</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Class</th>
              <th className="border p-3 text-left">Sex</th>
              <th className="border p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="border p-3">{student.Unique_ID}</td>
                <td className="border p-3">{`${student.First_Name} ${student.Father_Name}`}</td>
                <td className="border p-3">{student.Class}</td>
                <td className="border p-3">{student.Sex}</td>
                <td className="border p-3 text-center">
                  <Link
                    href={`/students/${student._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
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