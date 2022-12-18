import { decodeToken } from '../lib/utils'

export const redirectUser = async (context) => {
    const token = context.req ? context.req.cookies.token : null
    const decodedToken = await decodeToken(token)
    if (decodedToken) {
        return {
            userId: decodedToken.issuer,
            token,
        }
    } else {
        return {}
    }
}


