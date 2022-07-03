import { prompt } from 'enquirer';
import animeList from './anime-list.json';
import { getAllEpisodesOfSeason, getAllSeasons } from './animeScraper';

const animeListNames = animeList.map((animeEl) => animeEl.name);

function getAnimeUrl(animeName: string) {
  const anime = animeList.find((animeEl) => animeEl.name == animeName);
  if (!anime) return;
  return anime.url;
}

interface AnimeListPrompt {
  'anime-series': string;
}

async function main() {
  const { 'anime-series': animeSelected } = await prompt<AnimeListPrompt>({
    type: 'autocomplete',
    name: 'anime-series',
    message: 'Pick your Anime Serie',
    //@ts-ignore
    limit: 10,
    choices: animeListNames,
  });
  const animeUrl = getAnimeUrl(animeSelected);
  console.log(animeUrl);
}

async function season() {
  const url = 'https://aniworld.to/anime/stream/hunter-x-hunter';
  const seasons = await getAllSeasons(url);
  console.log(seasons);
}

async function episodes() {
  const url = 'https://aniworld.to/anime/stream/hunter-x-hunter/staffel-1';
  const episodes = await getAllEpisodesOfSeason(url);
  console.log(episodes);
}

main;
season;
episodes;
