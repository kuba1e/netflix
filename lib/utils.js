import { jwtVerify } from 'jose'

export const decodeToken = async (token) => {
    try {
        if (token) {
            const verified = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET)
            )
            return verified.payload ? verified.payload : {}
        }
        return null
    } catch (err) {
        console.error({ err })
        return null
    }
}
