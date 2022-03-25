import { createWriteStream } from 'fs';
import { get } from 'https';
import { basename, join } from 'path';

function downloadVideo(
  link: string,
  saveFolder: string,
  callback: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    let file = createWriteStream(saveFolder);
    get(link, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        // console.log('download complete');
        file.close(callback);
        resolve();
      });
    });
  });
}

export function downloadMultipleVideos(
  downloadLinks: string[],
  saveFolder: string
): Promise<void> {
  return new Promise(async (resolve) => {
    for (const link of downloadLinks) {
      let fileName = basename(link);
      let pathToFile = join(saveFolder, fileName);
      await downloadVideo(link, pathToFile, () => {
        console.log(`successfully downloaded video ${fileName}`);
      });
    }
    resolve();
  });
}
