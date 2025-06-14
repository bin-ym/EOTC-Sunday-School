// src/lib/imports.ts
export { useState, useEffect, useRef } from 'react';
export { default as Link } from 'next/link';
export { useRouter, useParams } from 'next/navigation';
export * as XLSX from 'xlsx';
export { saveAs } from 'file-saver';
export interface Student {
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
export interface Attendance {
  studentId: string;
  date: string;
  present: boolean;
  hasPermission: boolean;
}
export { default as AttendanceTable } from '../components/AttendanceTable';
export { default as NavBar } from '../components/NavBar';
export { default as ClientSessionProvider } from '../components/ClientSessionProvider';
export { signIn, signOut, useSession } from 'next-auth/react';