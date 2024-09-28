import { NextResponse } from 'next/server';
import { Mood } from '../../../lib/db';

export async function GET() {
  try {
    const moods = await Mood.findAll({ order: [['createdAt', 'DESC']] });
    return NextResponse.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMood = await Mood.create(body);
    return NextResponse.json(newMood, { status: 201 });
  } catch (error) {
    console.error('Error creating mood:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}