import axios from 'axios';
import { load } from 'cheerio';
import { Text } from 'domhandler';
import { writeFile } from 'fs/promises';

function sortAlphabetically(a: string, b: string) {
  return a.localeCompare(b);
}

async function getAllAnimes() {
  const aniworldAnimeUrl = 'https://aniworld.to/animes';
  const res = await axios.get(aniworldAnimeUrl);
  const $ = load(res.data);
  const allAnimeElements = $('.seriesList li a').toArray();
  const allAnimeDatas = allAnimeElements.map((animeElement) => {
    const url = new URL(aniworldAnimeUrl);
    url.pathname = animeElement.attribs['href']!;
    const name = (animeElement.children[0] as Text).data;
    return { url: url.toString(), name };
  });
  allAnimeDatas.sort((a, b) => sortAlphabetically(a.name, b.name));
  return allAnimeDatas;
}

async function writeAnimes() {
  const animeList = await getAllAnimes();
  const animeListJson = JSON.stringify(animeList, null, 2);
  const pathToFile = 'src/anime-list.json';
  writeFile(pathToFile, animeListJson).then(() => console.log('done'));
}

writeAnimes();
