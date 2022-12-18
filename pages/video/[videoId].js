import { useRouter } from 'next/router'
import clsx from 'classnames'
import { format } from 'date-fns'
import ReactModal from 'react-modal'
import Navbar from '../../components/nav/navbar'
import styles from '../../styles/Video.module.css'
import { getYoutubeVideoById } from '../../lib/videos'
import { Dislike, Like } from '../../components/icons'
import { useCallback, useEffect, useState } from 'react'

ReactModal.setAppElement('#__next')

export async function getStaticProps({ params }) {
    const videoInfo = await getYoutubeVideoById(params.videoId)
    return {
        props: { video: videoInfo.length > 0 ? videoInfo[0] : {} },
        revalidate: 10,
    }
}

export async function getStaticPaths() {
    const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ']

    const paths = listOfVideos.map((videoId) => ({
        params: { videoId },
    }))

    return {
        paths,
        fallback: 'blocking',
    }
}

function Video({ video }) {
    const router = useRouter()

    const videoId = router.query.videoId

    const [toggleLike, setToggleLike] = useState(false)
    const [toggleDislike, setToggleDislike] = useState(false)

    useEffect(() => {
        const getVideoFavourited = async (videoId) => {
            const response = await fetch(`/api/stats?videoId=${videoId}`)
            return await response.json()
        }
        getVideoFavourited(videoId).then(({ data = {} }) => {
            const favourited = data[0]?.favourited
            if (favourited === 1) {
                setToggleLike(true)
            } else if (favourited === 0) {
                setToggleDislike(true)
            }
        })
    }, [videoId])

    const runRatingService = useCallback(
        async (favourited) => {
            await fetch(`/api/stats?videoId=${videoId}`, {
                method: 'POST',
                body: JSON.stringify({ favourited }),
            })
        },
        [videoId]
    )

    const handleToggleLike = useCallback(async () => {
        const val = !toggleLike
        setToggleLike(val)
        toggleDislike && setToggleDislike(false)

        const favourited = val ? 1 : 0

        runRatingService(favourited)
    }, [toggleDislike, toggleLike, runRatingService])

    const handleToggleDislike = useCallback(async () => {
        const val = !toggleDislike

        setToggleDislike(val)
        toggleLike && setToggleLike(false)
        const favourited = val ? 0 : 1
        runRatingService(favourited)
    }, [toggleLike, toggleDislike, runRatingService])

    const {
        title,
        publishTime,
        description,
        channelTitle,
        statistics: { viewCount },
    } = video

    return (
        <div>
            <Navbar />
            <ReactModal
                isOpen={true}
                contentLabel="Watch the video"
                onRequestClose={() => router.back()}
                overlayClassName={styles.overlay}
                className={styles.modal}
            >
                <iframe
                    id="ytplayer"
                    className={styles.videoPlayer}
                    type="text/html"
                    width="100%"
                    height="360"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                    frameBorder="0"
                ></iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <button onClick={handleToggleLike}>
                        <div
                            className={clsx(
                                styles.btnWrapper,
                                styles.likeBtnWrapper
                            )}
                        >
                            <Like selected={toggleLike} />
                        </div>
                    </button>
                    <button onClick={handleToggleDislike}>
                        <div className={styles.btnWrapper}>
                            <Dislike selected={toggleDislike} />
                        </div>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>
                                {format(new Date(publishTime), 'MM/dd/yyyy')}
                            </p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p
                                className={clsx(
                                    styles.subText,
                                    styles.subTextWrapper
                                )}
                            >
                                <span className={styles.textColor}>Cast: </span>
                                <span className={styles.channelTitle}>
                                    {channelTitle}
                                </span>
                            </p>
                            <p
                                className={clsx(
                                    styles.subText,
                                    styles.subTextWrapper
                                )}
                            >
                                <span className={styles.textColor}>
                                    View Count:{' '}
                                </span>
                                <span className={styles.channelTitle}>
                                    {viewCount}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </ReactModal>
        </div>
    )
}

export default Video
