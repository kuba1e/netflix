import Head from 'next/head'
import Navbar from '../../components/nav/navbar'
import SectionCards from '../../components/section-cards'
import { getMyListVideos } from '../../lib/db/hasura'
import { getFavouritedVideos } from '../../lib/videos'

import styles from '../../styles/MyList.module.css'
import { redirectUser } from '../../utils/redirectUser'

export async function getServerSideProps(context) {
    const { userId, token } = await redirectUser(context)
    if (!userId) {
        return {
            props: {},
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    const videos = await getFavouritedVideos(token, userId)

    return {
        props: { videos },
    }
}

function MyList({ videos = [] }) {
    return (
        <div>
            <Head>
                <title>My List</title>
            </Head>
            <main className={styles.main}>
                <Navbar />
                <div className={styles.sectionWrapper}>
                    <SectionCards
                        title="My List"
                        videos={videos}
                        size="medium"
                        shouldWrap
                        shouldScale={false}
                    />
                </div>
            </main>
        </div>
    )
}

export default MyList
