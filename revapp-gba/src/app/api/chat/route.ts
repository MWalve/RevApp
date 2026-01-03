// app/api/chat/route.ts
import { NextResponse } from 'next/server';

// Backend API URL - configurable via environment variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const { query, user_data } = await request.json();
    
    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query parameter' },
        { status: 400 }
      );
    }

    console.log("Received query:", query.substring(0, 50) + "...");

    // Call FastAPI backend instead of spawning Python process
    const response = await fetch(`${BACKEND_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        user_data: user_data || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Backend request failed');
    }

    const data = await response.json();
    console.log("Response received from backend");

    return NextResponse.json({ 
      response: data.response,
      status: data.status 
    });

  } catch (error) {
    console.error('Error calling backend:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Failed to process query';
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Backend server is not running. Please start the FastAPI backend.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}