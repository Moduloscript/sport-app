import { Env } from '../../../src/types';

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
  }[];
}

interface Article {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/news/football') {
      try {
        const apiKey = env.NEWS_API_KEY;
        if (!apiKey) {
          return new Response('Missing API configuration', { status: 500 });
        }
        
        const apiUrl = `https://newsapi.org/v2/everything?q=football&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json() as NewsAPIResponse;
        
        if (!response.ok) {
          const errorData = await response.json() as { message?: string };
          return new Response(errorData.message || 'News API error', { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Format articles with only necessary fields
        const articles: Article[] = data.articles.map((article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          publishedAt: article.publishedAt
        }));
        
        return new Response(JSON.stringify({ articles }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        return new Response(err.message, { status: 500 });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};
