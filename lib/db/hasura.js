export async function queryHasuraGQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
        {
            method: 'POST',
            headers: {
                'x-hasura-admin-secret':process.env.NEXT_PUBLIC_HASURA_ADMIN_KEY,
            },
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
        }
    )

    return await result.json()
}

