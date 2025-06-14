// src/constant/index.ts
import { getDb } from '../lib/mongodb';
import { Student } from '../lib/imports';

export async function getStudents(): Promise<Student[]> {
  try {
    const db = await getDb();
    return await db.collection<Student>('students').find().toArray();
  } catch {
    return [];
  }
}

export async function addStudent(student: Omit<Student, 'id' | 'ID_Number'>): Promise<Student> {
  if (!student.Academic_Year.match(/^\d{4}$/)) {
    throw new Error('Invalid Academic Year');
  }
  const db = await getDb();
  const yearLastTwoDigits = student.Academic_Year.slice(-2);
  const counterResult = await db.collection<{ _id: string; seq: number }>('counters').findOneAndUpdate(
    { _id: `student_${student.Academic_Year}` },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  const seq = counterResult && counterResult.seq ? counterResult.seq : 1;
  const ID_Number = `${yearLastTwoDigits}${seq.toString().padStart(4, '0')}`;
  const id = Math.random().toString(36).substr(2, 9);
  const newStudent = { ...student, id, ID_Number };
  await db.collection<Student>('students').insertOne(newStudent);
  return newStudent;
}

export async function updateStudent(id: string, updatedData: Partial<Student>): Promise<void> {
  const db = await getDb();
  await db.collection<Student>('students').updateOne(
    { id },
    { $set: updatedData }
  );
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = await getDb();
  return await db.collection<Student>('students').findOne({ id });
}