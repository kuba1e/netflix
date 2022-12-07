import videosData from '../data/videos.json'

const fetchVideos = async (url) => {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    const BASE_URL = 'youtube.googleapis.com/youtube/v3'
    const response = await fetch(
        `https://${BASE_URL}/${url}&maxResults=25&&key=${youtubeApiKey}`
    )

    return await response.json()
}

export async function getCommonVideos(url) {
    try {
        const isDevMode = process.env.DEVELOPMENT

        const data = isDevMode ? videosData : await fetchVideos(url)

        if (data.error) {
            console.error('Youtube API error', data.error)
        }

        return (
            data?.items?.map((item) => {
                const id = item.id?.videoId || item.id
                const snippet = item.snippet
                return {
                    title: snippet?.title,
                    imgUrl: item.snippet.thumbnails.high.url,
                    id,
                    description: snippet.description,
                    publishTime: snippet.publishedAt,
                    channelTitle: snippet.channelTitle,
                    statistics: item.statistics
                        ? item.statistics
                        : { viewCount: 0 },
                }
            }) || []
        )
    } catch (error) {
        console.error('Something went wrong', error)
        return []
    }
}

export const getVideos = async ({ searchQuery }) => {
    const URL = `search?type=video&part=snippet&q=${searchQuery}`

    return await getCommonVideos(URL)
}

export const getPopularVideos = () => {
    const URL =
        'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US'

    return getVideos(URL)
}

export const getYoutubeVideoById = async (videoId) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`
    return await getCommonVideos(URL)
}
