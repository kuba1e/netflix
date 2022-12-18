import Image from 'next/image'
import { useCallback, useState } from 'react'
import styles from './card.module.css'
import { motion } from 'framer-motion'
import cls from 'classnames'

const Card = ({
    imgUrl,
    size = 'medium',
    withCustomAnimation,
    shouldScale = true,
}) => {
    const [imgSrc, setImgSrc] = useState(imgUrl)

    const handleOnImgError = useCallback(() => {
        setImgSrc(
            'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80'
        )
    }, [])

    const classMap = {
        large: styles.lgItem,
        medium: styles.mdItem,
        small: styles.smItem,
    }

    const scale = withCustomAnimation ? { scaleY: 1.1 } : { scale: 1.1 }

    return (
        <div className={styles.container}>
            <motion.div
                {...(shouldScale ? { whileHover: scale } : {})}
                className={cls(styles.imgMotionWrapper, classMap[size])}
            >
                <Image
                    onError={handleOnImgError}
                    className={styles.cardImg}
                    src={imgSrc}
                    alt="Card image"
                    fill
                />
            </motion.div>
        </div>
    )
}

export default Card
