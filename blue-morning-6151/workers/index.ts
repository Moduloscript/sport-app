addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/news')) {
    // Replace with your News API endpoint and API key
    const newsApiUrl = 'https://newsapi.org/v2/everything?q=football&apiKey=YOUR_NEWSAPI_KEY';

    try {
      const response = await fetch(newsApiUrl);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json' },
      });
    } catch (error: unknown) {
      const err = error as Error;
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  return new Response(
    "Please make requests to /api/news to fetch football news."
  );
}
