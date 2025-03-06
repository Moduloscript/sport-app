import { useEffect, useState } from 'react';
import { getFootballNews } from '@/services/news';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Article } from '@/services/news';

export function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const articles = await getFootballNews();
        setNews(articles);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle>Error loading news</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((article) => (
        <NewsArticle key={article.url} article={article} />
      ))}
    </div>
  );
}

interface NewsArticleProps {
  article: Article;
}

function NewsArticle({ article }: NewsArticleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>
          {new Date(article.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{article.description}</p>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="mt-4 rounded-lg"
            loading="lazy"
          />
        )}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-500 hover:text-blue-700"
        >
          Read more →
        </a>
      </CardContent>
    </Card>
  );
}
