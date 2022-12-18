import Link from 'next/link'
import clsx from 'classnames'
import Card from '../card/card'
import styles from './section-cards.module.css'

function SectionCards(props) {
    const {
        title,
        videos = [],
        size,
        shouldWrap = false,
        shouldScale = true,
    } = props
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div
                className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}
            >
                {videos.map((video, idx, videosArray) => (
                    <Link key={video.id} href={`/video/${video.id}`}>
                        <Card
                            imgUrl={video.imgUrl}
                            size={size}
                            withCustomAnimation={
                                idx === 0 || idx === videosArray.length - 1
                            }
                            shouldScale={shouldScale}
                        />
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default SectionCards
