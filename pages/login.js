import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import styles from '../styles/Login.module.css'
import { magic } from '../lib/magic-client'

function Login() {
    const [userMsg, setUserMsg] = useState('')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleChangeRote = () => setIsLoading(false)

        router.events.on('routeChangeComplete', handleChangeRote)
        router.events.on('routeChangeError', handleChangeRote)

        return () => {
            router.events.off('routeChangeComplete', handleChangeRote)
            router.events.on('routeChangeError', handleChangeRote)
        }
    }, [router])

    const handleLoginWithEmail = useCallback(
        async (e) => {
            e.preventDefault()
            if (email.trim()) {
                setIsLoading(true)
                try {
                    const didToken = await magic.auth.loginWithMagicLink({
                        email,
                    })
                    didToken && router.push('/')
                } catch (error) {
                    setUserMsg('Something went wrong', error)
                } finally {
                }
            } else {
                setUserMsg('Enter a valid email address')
            }
        },
        [email, router]
    )

    const handleOnChangeEmail = useCallback((e) => {
        const email = e.target.value
        setEmail(email)
        setUserMsg('')
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <Link className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/static/netflix.svg"
                                width="126"
                                height="38"
                                alt="Netflix logo"
                            />
                        </div>
                    </Link>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>
                    <input
                        type="text"
                        placeholder="Email address"
                        className={styles.emailInput}
                        onChange={handleOnChangeEmail}
                    />
                    <p className={styles.userMsg}>{userMsg}</p>
                    <button
                        onClick={handleLoginWithEmail}
                        className={styles.loginBtn}
                    >
                        {isLoading ? 'Loading...' : 'Sign In'}
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login
