import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Google API')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Google Search API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get results from Google' },
      { status: 500 }
    )
  }
} 