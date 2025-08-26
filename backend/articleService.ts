// services/articleService.ts
/*
export const publishArticle = async (html: string) => {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: html }),
  });

  if (!res.ok) throw new Error('Failed to publish article');
  return await res.json();
};*/

import express, { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

const app = express();
const port = 3445;

app.get('/', (req: Request, res: Response) => {
  req.user = 'bobby_hadz'; // no TS error now
  console.log(req.user);

  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


