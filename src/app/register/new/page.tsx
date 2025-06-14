// src/app/register/new/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewStudent() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    First_Name: "",
    Father_Name: "",
    Grandfather_Name: "",
    Mothers_Name: "",
    Christian_Name: "",
    DOB_Date: "",
    DOB_Month: "",
    DOB_Year: "",
    Age: 0,
    Sex: "",
    Class: "",
    Occupation: "",
    School: "",
    School_Other: "",
    Educational_Background: "",
    Place_of_Work: "",
    Address: "",
    Address_Other: "",
    Academic_Year: "",
    Phone_Number: "",
    Grade: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
    }
  }, [status]);

  // Calculate age from Ethiopian Calendar DOB
  useEffect(() => {
    const { DOB_Date, DOB_Month, DOB_Year } = formData;
    if (DOB_Date && DOB_Month && DOB_Year) {
      const dob = parseInt(DOB_Year);
      const currentYear = 2017; // Ethiopian Calendar year (June 14, 2025 = ~2017 EC)
      const age = currentYear - dob;
      if (age >= 0) {
        setFormData((prev) => ({ ...prev, Age: age }));
      }
    }
  }, [formData.DOB_Date, formData.DOB_Month, formData.DOB_Year]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const textFields = [
      "First_Name",
      "Father_Name",
      "Grandfather_Name",
      "Mothers_Name",
      "Christian_Name",
      "Sex",
      "Occupation",
      "Address",
    ];
    const numberFields = ["DOB_Date", "DOB_Month", "DOB_Year", "Phone_Number", "Academic_Year"];

    // Required fields
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        key !== "School_Other" &&
        key !== "Address_Other" &&
        key !== "Educational_Background" &&
        key !== "Place_of_Work" &&
        key !== "School" &&
        key !== "Age" &&
        key !== "Class"
      ) {
        newErrors[key] = `${key.replace("_", " ")} is required`;
      }
    });

    // Class required for Student
    if (formData.Occupation === "Student" && !formData.Class) {
      newErrors.Class = "Class is required for students";
    }

    // No numbers in text fields
    textFields.forEach((key) => {
      if (formData[key] && /\d/.test(formData[key])) {
        newErrors[key] = `${key.replace("_", " ")} cannot contain numbers`;
      }
    });

    // Numbers only in number fields
    numberFields.forEach((key) => {
      if (formData[key] && !/^\d+$/.test(formData[key])) {
        newErrors[key] = `${key.replace("_", " ")} must contain numbers only`;
      }
    });

    // Conditional fields
    if (formData.Occupation === "Student" && !formData.School) {
      newErrors.School = "School is required for students";
    }
    if (formData.Occupation === "Worker") {
      if (!formData.Educational_Background) {
        newErrors.Educational_Background = "Educational Background is required for workers";
      }
      if (!formData.Place_of_Work) {
        newErrors.Place_of_Work = "Place of Work is required for workers";
      }
    }
    if (formData.Address === "Other" && !formData.Address_Other) {
      newErrors.Address_Other = "Please specify address";
    }
    if (formData.School === "Other" && !formData.School_Other) {
      newErrors.School_Other = "Please specify school";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateUniqueID = async (academicYear: string, grade: string) => {
    const year = academicYear.slice(-2); // e.g., 2017 -> 17
    const gradeNum = grade.match(/\d+/)?.[0]?.padStart(2, "0") || "01"; // e.g., Grade 7 -> 07
    try {
      const res = await fetch("/api/students/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academicYear, grade }),
      });
      if (!res.ok) {
        console.error('Error fetching count:', await res.text()); // Debugging
        throw new Error('Failed to fetch student count');
      }
      const { count } = await res.json();
      console.log('Fetched count:', count); // Debugging
      const ordinal = (count + 1).toString().padStart(2, "0"); // e.g., 12
      return `ብሕ/${year}/${gradeNum}/${ordinal}`;
    } catch (error) {
      console.error('generateUniqueID error:', error); // Debugging
      return `ብሕ/${year}/${gradeNum}/01`; // Fallback
    }
  };

  const checkDuplicate = async () => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkDuplicate: true,
          First_Name: formData.First_Name,
          Father_Name: formData.Father_Name,
          Grandfather_Name: formData.Grandfather_Name,
          Mothers_Name: formData.Mothers_Name,
          Sex: formData.Sex,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { exists } = await res.json();
      return exists;
    } catch (error) {
      console.error('checkDuplicate error:', error); // Debugging
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix form errors");
      return;
    }

    // Check for duplicate student
    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      alert("Student already exists.");
      return;
    }

    try {
      const uniqueID = await generateUniqueID(formData.Academic_Year, formData.Grade);
      console.log('Generated Unique_ID:', uniqueID); // Debugging
      const dataToSubmit = {
        ...formData,
        Unique_ID: uniqueID,
        School: formData.School === "Other" ? formData.School_Other : formData.School,
        Address: formData.Address === "Other" ? formData.Address_Other : formData.Address,
      };
      console.log('Submitting data:', dataToSubmit); // Debugging
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Submission error:', errorText); // Debugging
        throw new Error(errorText);
      }
      alert("Student registered successfully!");
      router.push("/register");
    } catch (error) {
      console.error('handleSubmit error:', error); // Debugging
      alert(`Registration failed: ${(error as Error).message}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? value.replace(/[^\d]/g, "")
        : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const numberFields = ["DOB_Date", "DOB_Month", "DOB_Year", "Phone_Number", "Academic_Year"];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const schools = [
    "ሀና", "ሀፒ ቪሌጄ", "ሂልሳይድ", "ህዳሴ", "ሆም ላንድ", "ሊዜም", "መሪ", "ሚሽን", "ማርቭል", "ሜሪኦን",
    "ምስራቅ", "ሰላም", "ሳንፎርድ", "ሳፋሪ", "ስኩል ኦፍ ቱምሮ", "ሮፋም", "ሽቡአጆርሳ", "ቅኔ", "ቅዱስ ሚካኤል",
    "ቅድስት ሬዛ", "በሻሌ", "ቤስት", "ቦሌ አዲስ", "ነዋይ", "ኒሺኒ ሆፕ", "ኒው ሰንላይት", "ናዝሬት",
    "አቡነ ጎርጎርዮስ", "አንድነት", "ኢትዮ ፓረንት", "እርግብ", "ኦዞን", "ኪዳነ ምሕረት", "ኪፓስ", "ካራሎ",
    "ወንድይራድ", "ውለታ", "የኒፎርም", "ያንግሩት", "ዳይመንድ", "ዴሊቨራንስ", "ጂባ", "ጊብሰን", "ግሎሪ",
    "ጽዮን ማርያም", "ፋውንቴን", "ፌርዌይ", "ፓንቶ ኮርቶር", "ፓንቶክራቶን", "ቪዥን", "ኤልቤተል", "ስላሴ ካቴድራል",
    "ሚሸን", "አንድነት", "72", "ራዕይ", "ቤ ዘ", "ቡርቃ ቦሬ", "ሚካኤል", "ኤደን", "ፊውቸር የዝ", "Other"
  ];

  const addresses = [
    "ጥቁር አባይ/ሚካኤል ጀርባ አካባቢ", "ሲቪል ሰርቪስ አካባቢ", "ወንድይራድ ት/ቤት አካባቢ",
    "ታቦት ማደሪያ/ኮተቤ ኮሌጅ አካባቢ", "ወሰን/አቅም ግንባታ አካባቢ", "አልታድ (ፊጋ) አካባቢ",
    "ሴፍ የመኖሪያ ቤቶች አካባቢ", "የተባበሩት አካባቢ", "ሰሚት አካባቢ", "ሲኤምሲ", "መሪ", "ላምበረት",
    "02", "ሰባ ሁለት", "ኢትዮ ዋልስ", "ሎቄ", "ኢትዮ ዊልስ", "አቤም", "ጣፎ", "ሰአሊተ ምሕረት", "አያት",
    "ካራ", "አባዶ", "Other"
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        New Student Registration
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="First_Name"
            value={formData.First_Name}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., ዮሐንስ"
            required
          />
          {errors.First_Name && <p className="text-red-500">{errors.First_Name}</p>}
        </div>
        <div>
          <label>Father Name</label>
          <input
            type="text"
            name="Father_Name"
            value={formData.Father_Name}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., ተክለ"
            required
          />
          {errors.Father_Name && <p className="text-red-500">{errors.Father_Name}</p>}
        </div>
        <div>
          <label>Grandfather Name</label>
          <input
            type="text"
            name="Grandfather_Name"
            value={formData.Grandfather_Name}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., ዳዊት"
            required
          />
          {errors.Grandfather_Name && <p className="text-red-500">{errors.Grandfather_Name}</p>}
        </div>
        <div>
          <label>Mother's Name</label>
          <input
            type="text"
            name="Mothers_Name"
            value={formData.Mothers_Name}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., ማርያም"
            required
          />
          {errors.Mothers_Name && <p className="text-red-500">{errors.Mothers_Name}</p>}
        </div>
        <div>
          <label>Christian Name</label>
          <input
            type="text"
            name="Christian_Name"
            value={formData.Christian_Name}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., ገብርኤል"
            required
          />
          {errors.Christian_Name && <p className="text-red-500">{errors.Christian_Name}</p>}
        </div>
        <div>
          <label>Date of Birth (Ethiopian Calendar)</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                name="DOB_Date"
                value={formData.DOB_Date}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                placeholder="Date, e.g., 15"
                required
              />
              {errors.DOB_Date && <p className="text-red-500">{errors.DOB_Date}</p>}
            </div>
            <div>
              <input
                type="text"
                name="DOB_Month"
                value={formData.DOB_Month}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                placeholder="Month, e.g., 6"
                required
              />
              {errors.DOB_Month && <p className="text-red-500">{errors.DOB_Month}</p>}
            </div>
            <div>
              <input
                type="text"
                name="DOB_Year"
                value={formData.DOB_Year}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                placeholder="Year, e.g., 2005"
                required
              />
              {errors.DOB_Year && <p className="text-red-500">{errors.DOB_Year}</p>}
            </div>
          </div>
        </div>
        <div>
          <label>Age (Calculated)</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            readOnly
            className="p-3 border rounded-lg w-full bg-gray-100"
          />
        </div>
        <div>
          <label>Sex</label>
          <select
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.Sex && <p className="text-red-500">{errors.Sex}</p>}
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="Phone_Number"
            value={formData.Phone_Number}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., 0912345678"
            required
          />
          {errors.Phone_Number && <p className="text-red-500">{errors.Phone_Number}</p>}
        </div>
        <div>
          <label>Occupation</label>
          <select
            name="Occupation"
            value={formData.Occupation}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          >
            <option value="">Select Occupation</option>
            <option value="Student">Student</option>
            <option value="Worker">Worker</option>
          </select>
          {errors.Occupation && <p className="text-red-500">{errors.Occupation}</p>}
        </div>
        {formData.Occupation === "Student" && (
          <>
            <div>
              <label>Class (World School)</label>
              <select
                name="Class"
                value={formData.Class}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              >
                <option value="">Select Class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={`Grade ${1 + i}`}>
                    Grade {1 + i}
                  </option>
                ))}
                <option value="University">University</option>
              </select>
              {errors.Class && <p className="text-red-500">{errors.Class}</p>}
            </div>
            <div>
              <label>School</label>
              <select
                name="School"
                value={formData.School}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              >
                <option value="">Select School</option>
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
              {errors.School && <p className="text-red-500">{errors.School}</p>}
            </div>
            {formData.School === "Other" && (
              <div>
                <label>Other School</label>
                <input
                  type="text"
                  name="School_Other"
                  value={formData.School_Other}
                  onChange={handleChange}
                  className="p-3 border rounded-lg w-full"
                  required
                />
                {errors.School_Other && <p className="text-red-500">{errors.School_Other}</p>}
              </div>
            )}
          </>
        )}
        {formData.Occupation === "Worker" && (
          <>
            <div>
              <label>Educational Background</label>
              <select
                name="Educational_Background"
                value={formData.Educational_Background}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              >
                <option value="">Select Educational Background</option>
                <option value="1-8">1-8</option>
                <option value="9-12">9-12</option>
                <option value="University">University</option>
              </select>
              {errors.Educational_Background && (
                <p className="text-red-500">{errors.Educational_Background}</p>
              )}
            </div>
            <div>
              <label>Place of Work</label>
              <select
                name="Place_of_Work"
                value={formData.Place_of_Work}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              >
                <option value="">Select Place of Work</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              {errors.Place_of_Work && <p className="text-red-500">{errors.Place_of_Work}</p>}
            </div>
          </>
        )}
        <div>
          <label>Address</label>
          <select
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          >
            <option value="">Select Address</option>
            {addresses.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
          {errors.Address && <p className="text-red-500">{errors.Address}</p>}
        </div>
        {formData.Address === "Other" && (
          <div>
            <label>Other Address</label>
            <input
              type="text"
              name="Address_Other"
              value={formData.Address_Other}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />
            {errors.Address_Other && <p className="text-red-500">{errors.Address_Other}</p>}
          </div>
        )}
        <div>
          <label>Grade (Sunday School)</label>
          <select
            name="Grade"
            value={formData.Grade}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          >
            <option value="">Select Grade</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={`Grade ${1 + i}`}>
                Grade {1 + i}
              </option>
            ))}
          </select>
          {errors.Grade && <p className="text-red-500">{errors.Grade}</p>}
        </div>
        <div>
          <label>Academic Year (Ethiopian Calendar)</label>
          <input
            type="text"
            name="Academic_Year"
            value={formData.Academic_Year}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            placeholder="e.g., 2017"
            required
          />
          {errors.Academic_Year && <p className="text-red-500">{errors.Academic_Year}</p>}
        </div>
        <div className="col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Register Student
          </button>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}