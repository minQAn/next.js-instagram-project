import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// https://www.sanity.io/docs/js-client#quickstart

export const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: false, // set to `false` to bypass the edge cache // 동적인 데이터가 주로 들어있음으로 사용하지 않음
    apiVersion: '2024-05-12', // use current date (YYYY-MM-DD) to target the latest API version
    token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

// @sanity/image-url
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
    .width(800)
    .url();
}

// assets upload (https://www.sanity.io/docs/http-api-assets)
// 형식: myProjectId.api.sanity.io/v2021-06-07/assets/images/myDataset
export const assetsURL = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/${process.env.SANITY_DATASET}`