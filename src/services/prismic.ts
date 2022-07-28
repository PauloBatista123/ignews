import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next';

export const repository = 'ignewsrsph';

export function getPrismicClient(req?: unknown){
  const client = prismic.createClient(
    repository,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      
    }
  );

  enableAutoPreviews({
    client,
    req: req,
  });

  return client;
}
