export async function addStats(
    token,
    { favourited, userId, videoId, watched }
) {
    const operationsDoc = `
mutation InsertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId:String! ) {
  insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
    favourited
    id
    userId
    videoId
    watched
  }
}`

    return await queryHasuraGQL(
        operationsDoc,
        'InsertStats',
        { favourited, userId, videoId, watched },
        token
    )
}

export async function updateStats(
    token,
    { favourited, userId, watched, videoId }
) {
    const operationsDoc = `
    mutation UpdateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: {watched: $watched, favourited: $favourited}, 
        where: {
          userId: {_eq: $userId}, 
          videoId: {_eq: $videoId}
        }) {
        returning {
          favourited,
          userId,
          watched,
          videoId
        }
      }
    }`

    return await queryHasuraGQL(
        operationsDoc,
        'UpdateStats',
        { favourited, userId, videoId, watched },
        token
    )
}

export async function findVideoIdByUser(token, { userId, videoId }) {
    const operationsDoc = `
  query FindVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
`
    const response = await queryHasuraGQL(
        operationsDoc,
        'FindVideoIdByUserId',
        { userId, videoId },
        token
    )

    return response.data.stats
}

export async function isNewUser(token, issuer) {
    const operationsDoc = `
  query IsNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`

    const response = await queryHasuraGQL(
        operationsDoc,
        'IsNewUser',
        { issuer },
        token
    )
    return response?.data?.users?.length === 0
}

export async function createNewUser(token, { issuer, email, publicAddress }) {
    const operationsDoc = `
  mutation CreateNewUser($email: String!, $issuer: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`

    return await queryHasuraGQL(
        operationsDoc,
        'CreateNewUser',
        { issuer, email, publicAddress },
        token
    )
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            query: operationsDoc,
            variables,
            operationName,
        }),
    })

    return await result.json()
}

export async function getWatchedVideo(token, { userId }) {
    const operationsDoc = `
  query QueryWatchedVideo( $userId: String!) {
    stats(where: { userId: {_eq: $userId}, watched:{_eq:true}}) {
      id
      userId
      videoId
      favourited
      watched
    }
    }
`

    const response = await queryHasuraGQL(
        operationsDoc,
        'QueryWatchedVideo',
        { userId },
        token
    )
    return response.data?.stats
}

export async function getMyListVideos(token, { userId }) {
    const operationsDoc = `
  query QueryFavouritedVideo( $userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      watched: {_eq: true},
      favourited: {_eq: 1}}) {
      videoId
    }
    }
`

    const response = await queryHasuraGQL(
        operationsDoc,
        'QueryFavouritedVideo',
        { userId },
        token
    )
    return response.data?.stats
}
