import jwt from 'jsonwebtoken'

export const decodeToken = async (token) => {
    try {
        return await jwt.verify(token, process.env.HASURA_JWT_SECRET_KEY)
    } catch (e) {}
}
