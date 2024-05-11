import { createClient } from '@sanity/client'

// https://www.sanity.io/docs/js-client#quickstart

export const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: true, // set to `false` to bypass the edge cache // 동적인 데이터가 주로 들어있음으로 사용하지 않음
    apiVersion: '2024-05-11', // use current date (YYYY-MM-DD) to target the latest API version
    token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
  })