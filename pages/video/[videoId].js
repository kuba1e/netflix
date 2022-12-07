import { useRouter } from 'next/router'
import clsx from 'classnames'
import { format } from 'date-fns'
import ReactModal from 'react-modal'
import Navbar from '../../components/nav/navbar'
import styles from '../../styles/Video.module.css'
import { getYoutubeVideoById } from '../../lib/videos'

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

    const {
        title,
        publishTime,
        description,
        channelTitle,
        statistics: { viewCount },
    } = video

    return (
        <div>

            <Navbar/>
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
                    src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                    frameBorder="0"
                ></iframe>
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
