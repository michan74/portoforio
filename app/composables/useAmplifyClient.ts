import { generateClient } from 'aws-amplify/data'
import type { Schema } from '~/amplify/data/resource'

export function useAmplifyClient() {
  const client = generateClient<Schema>()
  return client
}
