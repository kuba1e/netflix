import styles from './banner.module.css'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Banner = ({ imgUrl, title, subTitle, videoId }) => {
    const router = useRouter()
    const handleOnPlay = useCallback(() => {
        router.push(`/video/${videoId}`)
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.leftWrapper}>
                <div className={styles.left}>
                    <div className={styles.nseriesWrapper}>
                        <p className={styles.firstLetter}>N</p>
                        <p className={styles.series}>S E R I E S</p>
                    </div>

                    <h3 className={styles.title}>{title}</h3>
                    <h3 className={styles.subTitle}>{subTitle}</h3>
                    <div className={styles.playBtnWrapper}>
                        <button
                            className={styles.btnWithIcon}
                            onClick={handleOnPlay}
                        >
                            <Image
                                alt="play button"
                                src={'/static/play.svg'}
                                width="32"
                                height="32"
                            />
                            <span className={styles.playText}>Play</span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={styles.bannerImg}
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                }}
            />
        </div>
    )
}

export default Banner
