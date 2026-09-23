import { NextResponse } from 'next/server';

const USDA_API_KEY = process.env.USDA_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  if (!USDA_API_KEY) {
    return NextResponse.json({ error: 'USDA API key not configured on server' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10&dataType=Survey (FNDDS)`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch food data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error searching foods:', err);
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 });
  }
}
