const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

export async function searchYouTubeVideo(query: string): Promise<{ id: string; title: string }> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&key=${YOUTUBE_API_KEY}&maxResults=1`
    )

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const video = data.items[0]
      return {
        id: video.id.videoId,
        title: video.snippet.title
      }
    }

    throw new Error('No videos found')
  } catch (error) {
    console.error('Error searching YouTube:', error)
    throw error
  }
} 