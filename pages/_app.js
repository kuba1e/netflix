import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loader } from '../components/loader'
import { magic } from '../lib/magic-client'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const isLoggedIn = async () => await magic.user.isLoggedIn()
        isLoggedIn().then((isLogged) => {
            console.log(isLogged)
            if (!isLogged) {
                router.push('/login')
            } else {
                router.push('/')
            }
        })
    }, [])

    useEffect(() => {
        const handleChangeRote = () => setIsLoading(false)

        router.events.on('routeChangeComplete', handleChangeRote)
        router.events.on('routeChangeError', handleChangeRote)

        return () => {
            router.events.off('routeChangeComplete', handleChangeRote)
            router.events.on('routeChangeError', handleChangeRote)
        }
    }, [router])

    if (isLoading) {
        return <Loader/>
    }

    return <Component {...pageProps} />
}

export default MyApp
