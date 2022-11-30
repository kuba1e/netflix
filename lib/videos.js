export async function getCommonVideos(url) {
    try {
        const youtubeApiKey = process.env.YOUTUBE_API_KEY
        const BASE_URL = 'youtube.googleapis.com/youtube/v3'
        const response = await fetch(
            `https://${BASE_URL}/${url}&maxResults=25&&key=${youtubeApiKey}`
        )

        const data = await response.json()

        if (data.error) {
            console.error('Youtube API error', data.error)
        }

        return (
            data?.items?.map((item) => ({
                id: item?.id?.videoId,
                imgUrl: item?.snippet?.thumbnails?.high?.url,
                title: item?.snippet?.title,
            })) || []
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
