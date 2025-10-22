// services/articleService.ts
export const publishArticle = async (html: string) => {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: html }),
  });

  if (!res.ok) throw new Error('Failed to publish article');
  return await res.json();
};
