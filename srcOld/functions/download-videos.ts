import { createWriteStream, unlink } from 'fs';
import { get } from 'https';

export function downloadVideo(
  link: string,
  pathToFile: string,
  callback: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(pathToFile);
    const request = get(link, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(callback); // console.log('download complete');
        resolve();
      });
    });
    request.on('error', (error) => {
      unlink(pathToFile, (error) => {
        if (error) console.error(error);
      });
      reject(error);
    });
  });
}
