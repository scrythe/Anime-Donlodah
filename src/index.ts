import { prompt } from 'enquirer';
import animeList from './anime-list.json';
import { getAllEpisodes } from './animeScraper';
import { AllEpisodes } from './interfaces';

const animeListNames = animeList.map((animeEl) => animeEl.name);

function getAnimeUrl(animeName: string) {
  const anime = animeList.find((animeEl) => animeEl.name == animeName);
  if (!anime) return;
  return anime.url;
}

function getEpisodesOfSeason(seasonName: string, seasons: AllEpisodes) {
  const season = seasons.find((season) => season.name == seasonName);
  if (!season) return;
  return season.episodes;
}

interface AnimeListPrompt {
  selectedAnime: string;
}

interface SeasonPrompt {
  selectedSeason: string;
}

interface EpisodePrompt {
  selectedEpisode: string;
}

async function main() {
  const { selectedAnime } = await prompt<AnimeListPrompt>({
    type: 'autocomplete',
    name: 'selectedAnime',
    message: 'Pick your Anime Serie',
    //@ts-ignore
    limit: 10,
    choices: animeListNames,
  });

  const animeUrl = getAnimeUrl(selectedAnime);
  if (!animeUrl) return;
  const seasons = await getAllEpisodes(animeUrl);
  const seasonNames = seasons.map((season) => season.name);

  const { selectedSeason } = await prompt<SeasonPrompt>({
    type: 'autocomplete',
    name: 'selectedSeason',
    message: 'Select Start and End of Episodes \n Select Start Season',
    //@ts-ignore
    limit: 10,
    choices: seasonNames,
  });

  const episodesOfSeason = getEpisodesOfSeason(selectedSeason, seasons);
  if (!episodesOfSeason) return;
  const episodeNames = episodesOfSeason.map((episode) => episode.name);

  const { selectedEpisode } = await prompt<EpisodePrompt>({
    type: 'autocomplete',
    name: 'selectedEpisode',
    message: 'Select Start and End of Episodes \n Select Start Episode',
    //@ts-ignore
    limit: 10,
    choices: episodeNames,
  });

  console.log(selectedEpisode);
}

main();
