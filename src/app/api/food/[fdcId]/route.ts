import { NextResponse } from 'next/server';

const USDA_API_KEY = process.env.USDA_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fdcId: string }> }
) {
  const { fdcId } = await params;

  if (!USDA_API_KEY) {
    return NextResponse.json({ error: 'USDA API key not configured on server' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${encodeURIComponent(fdcId)}?api_key=${USDA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch food details');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching food details:', err);
    return NextResponse.json({ error: 'Failed to fetch food details' }, { status: 500 });
  }
}
