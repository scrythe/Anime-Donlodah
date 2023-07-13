import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import getAnimeList from 'scrape9anime';

const prisma = new PrismaClient();
const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(bodyParser.json());

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080/');
});

app.get('/anime-list', async (_req, res) => {
  const animes = await prisma.anime.findMany();
  res.status(200).json({ animes });
});

getAnimeList();

export default app;
