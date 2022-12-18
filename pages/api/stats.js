import { addStats, findVideoIdByUser, updateStats } from '../../lib/db/hasura'
import { decodeToken } from '../../lib/utils'

export default async function stats(req, res) {
    try {
        const token = req.cookies.token
        const { videoId } = req.query
        if (!token) {
            res.status(403).send({})
        } else {
            const decodedToken = await decodeToken(token)
            if (videoId) {
                const findVideo = await findVideoIdByUser(token, {
                    userId: decodedToken.issuer,
                    videoId,
                })

                const doesStatsExist = findVideo.length > 0
                if (req.method === 'POST') {
                    const { watched = true, favourited } = JSON.parse(req.body)
                    if (doesStatsExist) {
                        const response = await updateStats(token, {
                            watched,
                            userId: decodedToken.issuer,
                            videoId,
                            favourited,
                        })
                        res.send({ data: response })
                    } else {
                        const response = await addStats(token, {
                            watched,
                            userId: decodedToken.issuer,
                            videoId,
                            favourited,
                        })
                        res.send({ data: response })
                    }
                }
                if (req.method === 'GET') {
                    if (doesStatsExist) {
                        res.send({ data: findVideo })
                    } else {
                        res.send({ data: [] })
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error ocurred /stats', error.message)
        res.status(500).send({ success: false, message: error.message })
    }
}
