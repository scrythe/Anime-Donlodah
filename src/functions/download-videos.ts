import { createWriteStream, unlink } from 'fs';
import { get } from 'https';
import { basename, join } from 'path';

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
        // console.log('download complete');
        file.close(callback);
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

/* function handleDownloadVideo(
  link: string,
  saveFolder: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const fileName = basename(link);
    const pathToFile = join(saveFolder, fileName);
    const downloadVideoPromise: Promise<string> = new Promise(
      async (resolve, reject) => {
        await downloadVideo(link, pathToFile, () => {
          console.log(`successfully downloaded video ${fileName}`);
        }).catch((error) => reject(error));
        resolve('done');
      }
    );
    const downloadVideoResolved = await downloadVideoPromise.catch((error) =>
      reject(error)
    );
    if (!downloadVideoResolved) return;
    resolve(downloadVideoResolved);
  });
} */

/* export function downloadMultipleVideos(
  downloadLinks: string[],
  saveFolder: string
): Promise<void> {
  return new Promise(async (resolve) => {
    for (const link of downloadLinks) {
      const fileName = basename(link);
      const pathToFile = join(saveFolder, fileName);
      await downloadVideo(link, pathToFile, () => {
        console.log(`successfully downloaded video ${fileName}`);
      }).catch((error) => console.error(error));
    }
    resolve();
  });
} */
