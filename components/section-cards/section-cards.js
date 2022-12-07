import Link from 'next/link'
import Card from '../card/card'
import styles from './section-cards.module.css'

function SectionCards(props) {
    const { title, videos = [], size } = props
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.cardWrapper}>
                {videos.map((video, idx) => (
                    <Link key={video.id} href={`video/${video.id}`}>
                        <Card imgUrl={video.imgUrl} size={size} idx={idx} />
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default SectionCards
