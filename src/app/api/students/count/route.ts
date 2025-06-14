// src/app/api/students/count/route.ts
import { getDb } from '../../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('POST request received at /api/students/count'); // Debugging
  try {
    const { academicYear, grade } = await req.json();
    console.log('Count query:', { academicYear, grade }); // Debugging
    const db = await getDb();
    const count = await db.collection('students').countDocuments({
      Academic_Year: academicYear,
      Grade: grade,
    });
    console.log('Count result:', count); // Debugging
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/students/count:', error); // Debugging
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}