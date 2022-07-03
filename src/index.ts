import { prompt } from 'enquirer';
import animeList from './anime-list.json';
import { getAllEpisodes } from './animeScraper';
import { AllEpisodes, Episode } from './interfaces';

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

async function selectEpisode(seasons: AllEpisodes, startOrEnd: string) {
  const seasonNames = seasons.map((season) => season.name);

  const { selectedSeason } = await prompt<SeasonPrompt>({
    type: 'autocomplete',
    name: 'selectedSeason',
    message: `Select Start and End of Episodes \n Select ${startOrEnd} Season`,
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
    message: `Select Start and End of Episodes \n Select ${startOrEnd} Episode`,
    //@ts-ignore
    limit: 10,
    choices: episodeNames,
  });

  return selectedEpisode;
}

function selectEpisodesBetween(
  startEpisodeName: string,
  endEpisodeName: string,
  allEpisodes: Episode[]
) {
  const startEpisode = allEpisodes.find(
    (episode) => episode.name == startEpisodeName
  );
  const endEpisode = allEpisodes.find(
    (episode) => episode.name == endEpisodeName
  );

  if (!startEpisode) return;
  if (!endEpisode) return;

  const startEpisodeIndex = allEpisodes.indexOf(startEpisode);
  const endEpisodeIndex = allEpisodes.indexOf(endEpisode);

  const selectedEpisodes = allEpisodes.slice(
    startEpisodeIndex,
    endEpisodeIndex + 1
  );

  return selectedEpisodes;
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

  const episodeStart = await selectEpisode(seasons, 'start');
  const episodeEnd = await selectEpisode(seasons, 'end');

  const allEpisodes = seasons.map((season) => season.episodes).flat();
  if (!episodeStart) return;
  if (!episodeEnd) return;

  const selectedEpisodes = selectEpisodesBetween(
    episodeStart,
    episodeEnd,
    allEpisodes
  );

  console.log(selectedEpisodes);
}

async function selectedEpisodesTest() {
  const animeUrl = getAnimeUrl('Hunter x Hunter');
  if (!animeUrl) return;
  const seasons = await getAllEpisodes(animeUrl);
  const episodeStart = 'Departure x And x Friends [Episode 001]';
  const episodeEnd = 'Strengthen x And x Threaten [Episode 064]';
  const allEpisodes = seasons.map((season) => season.episodes).flat();
  const selectedEpisodes = selectEpisodesBetween(
    episodeStart,
    episodeEnd,
    allEpisodes
  );
  console.log(selectedEpisodes);
}

main();
selectedEpisodesTest;
