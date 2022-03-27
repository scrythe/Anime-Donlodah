import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
