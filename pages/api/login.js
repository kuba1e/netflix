import { magicAdmin } from '../../lib/magic'
import jwt from 'jsonwebtoken'
import { isNewUser, createNewUser } from '../../lib/db/hasura'
import { setTokenCookie } from '../../lib/cookies'

export default async function login(req, res) {
    if (req.method === 'POST') {
        try {
            const auth = req.headers.authorization
            const didToken = auth ? auth.substr(7) : ''

            const metaData = await magicAdmin.users.getMetadataByToken(didToken)

            const token = jwt.sign(
                {
                    ...metaData,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                    'https://hasura.io/jwt/claims': {
                        'x-hasura-allowed-roles': ['admin', 'user'],
                        'x-hasura-default-role': 'user',
                        'x-hasura-user-id': metaData.issuer,
                    },
                },
                process.env.HASURA_JWT_SECRET_KEY
            )

            const isNewUserQuery = await isNewUser(token, metaData.issuer)

            isNewUserQuery && (await createNewUser(token, metaData))
            setTokenCookie(token, res)
            res.send({ success: true })
        } catch (error) {
            res.status(500).send({ success: false })
        }
    } else {
        res.send({ success: false })
    }
}
