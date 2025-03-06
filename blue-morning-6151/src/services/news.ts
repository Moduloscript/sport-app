import { z } from 'zod';

const ArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  image: z.string().url().optional(),
  publishedAt: z.string().datetime(),
});

const NewsResponseSchema = z.object({
  articles: z.array(ArticleSchema),
});

export type NewsResponse = z.infer<typeof NewsResponseSchema>;
export type Article = z.infer<typeof ArticleSchema>;

const CACHE_KEY = 'news_cache';
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function fetchNews(): Promise<NewsResponse> {
  try {
    // Check cache first
    const cachedResponse = localStorage.getItem(CACHE_KEY);
    if (cachedResponse) {
      const parsedCache = JSON.parse(cachedResponse);
      if (Date.now() - parsedCache.timestamp < CACHE_TTL) {
        return parsedCache.data;
      }
    }

    const response = await fetch('/api/news');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = NewsResponseSchema.parse(data);

    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: validatedData
    }));

    return validatedData;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw new Error('Failed to fetch news. Please try again later.');
  }
}

export async function getFootballNews(): Promise<Article[]> {
  try {
    const { articles } = await fetchNews();
    return articles;
  } catch (error) {
    console.error('Failed to get football news:', error);
    throw error;
  }
}
