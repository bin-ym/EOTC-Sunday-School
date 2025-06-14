// src/app/api/students/route.ts
import { getDb } from '../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('GET request received at /api/students'); // Debugging
  try {
    const db = await getDb();
    const students = await db.collection('students').find({}).toArray();
    console.log('Fetched students count:', students.length); // Debugging
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('GET /api/students error:', error); // Debugging
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST request received at /api/students'); // Debugging
  try {
    const data = await req.json();
    console.log('Data received:', data); // Debugging
    const db = await getDb();
    const studentsCollection = db.collection('students');

    // Handle duplicate check
    if (data.checkDuplicate) {
      const { First_Name, Father_Name, Grandfather_Name, Mothers_Name, Sex } = data;
      const existingStudent = await studentsCollection.findOne({
        First_Name,
        Father_Name,
        Grandfather_Name,
        Mothers_Name,
        Sex,
      });
      console.log('Duplicate check result:', !!existingStudent); // Debugging
      return NextResponse.json({ exists: !!existingStudent }, { status: 200 });
    }

    // Insert new student
    const result = await studentsCollection.insertOne(data);
    console.log('Insert result:', result); // Debugging
    return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error('POST /api/students error:', error); // Debugging
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}