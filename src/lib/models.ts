// src/lib/models.ts
export interface Student {
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

export interface Attendance {
  studentId: string;
  date: string;
  present: boolean;
  hasPermission: boolean;
}