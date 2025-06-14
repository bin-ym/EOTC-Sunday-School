// src/app/api/students/[id]/route.ts
import { getDb } from '../../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('GET request received at /api/students/[id]', params.id); // Debugging
  try {
    const db = await getDb();
    const student = await db.collection('students').findOne({ _id: new ObjectId(params.id) });
    console.log('Fetched student:', student); // Debugging
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('GET /api/students/[id] error:', error); // Debugging
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}