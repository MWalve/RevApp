// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    console.log("Received query:", query); // Debug log

    const { stdout, stderr } = await execAsync(
      `python src/lib/run_rag.py "${query}"`
    );

    if (stderr) {
      console.error('Python Error:', stderr);
    }

    console.log("Response:", stdout); // Debug log

    return NextResponse.json({ response: stdout.trim() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' }, 
      { status: 500 }
    );
  }
}