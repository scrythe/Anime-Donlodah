import { join } from 'path';
import { readFile } from 'fs/promises';

type AnimeEpisdoes = string[];

export function getEpisodes(): Promise<AnimeEpisdoes> {
  return new Promise(async (resolve, reject) => {
    const pathToFile = join(__dirname, '..', '..', 'src', 'episode-list.json');
    const contentOfFile = await readFile(pathToFile).catch((error) =>
      reject(error)
    );
    if (!contentOfFile) return;
    const animeEpisodes: AnimeEpisdoes = JSON.parse(contentOfFile.toString());
    resolve(animeEpisodes);
  });
}
