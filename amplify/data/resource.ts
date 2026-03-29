import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // 訪問者カウント（シングルトン的に使用）
  VisitorCount: a
    .model({
      count: a.integer().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
