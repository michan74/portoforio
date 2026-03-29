const VISITOR_COUNT_ID = 'main'

async function graphqlRequest(url: string, apiKey: string, query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ query, variables }),
  })
  return response.json()
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const { appsyncUrl, appsyncApiKey } = config

  if (!appsyncUrl || !appsyncApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AppSync configuration missing' })
  }

  // 訪問者カウントを取得
  const getResult = await graphqlRequest(appsyncUrl, appsyncApiKey, `
    query GetVisitorCount($id: ID!) {
      getVisitorCount(id: $id) {
        id
        count
      }
    }
  `, { id: VISITOR_COUNT_ID })

  const currentCount = getResult.data?.getVisitorCount?.count ?? 0
  const newCount = currentCount + 1

  if (currentCount === 0) {
    // 初回：作成
    await graphqlRequest(appsyncUrl, appsyncApiKey, `
      mutation CreateVisitorCount($input: CreateVisitorCountInput!) {
        createVisitorCount(input: $input) {
          id
          count
        }
      }
    `, { input: { id: VISITOR_COUNT_ID, count: newCount } })
  } else {
    // 更新
    await graphqlRequest(appsyncUrl, appsyncApiKey, `
      mutation UpdateVisitorCount($input: UpdateVisitorCountInput!) {
        updateVisitorCount(input: $input) {
          id
          count
        }
      }
    `, { input: { id: VISITOR_COUNT_ID, count: newCount } })
  }

  return {
    visitCount: newCount,
  }
})
