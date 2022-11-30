import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { magic } from '../../lib/magic-client'
import styles from './navbar.module.css'

const Navbar = () => {
    const router = useRouter()
    const [username, setUsername] = useState('')

    const [shodDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            try {
                const { email } = await magic.user.getMetadata()
                setUsername(email)
            } catch (error) {}
        }
        getUser()
    }, [])

    const handleOnClickHome = useCallback(
        (e) => {
            e.preventDefault()
            router.push('/')
        },
        [router]
    )

    const handleOnClickMyList = useCallback(() => {}, [])

    const handleShowDropdown = useCallback((e) => {
        e.preventDefault()
        setShowDropdown((prevState) => !prevState)
    }, [])

    const handleSignOut = useCallback(
        async (e) => {
            e.preventDefault()
            try {
                await magic.user.logout()
            } catch (error) {
            } finally {
                router.push('/login')
            }
        },
        [router]
    )

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.wrapper}>
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
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome}>
                        Home
                    </li>
                    <li
                        className={styles.navItem}
                        onClick={handleOnClickMyList}
                    >
                        My list
                    </li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button
                            className={styles.usernameBtn}
                            onClick={handleShowDropdown}
                        >
                            <p className={styles.username}>{username}</p>
                            <Image
                                src="/static/expandMore.svg"
                                width="24"
                                height="24"
                                alt="Expand dropdown"
                            />
                        </button>
                        {shodDropdown ? (
                            <div className={styles.navDropdown}>
                                <div>
                                    <a
                                        className={styles.linkName}
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </a>
                                    <div className={styles.lineWrapper}></div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Navbar
