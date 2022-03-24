import { createWriteStream } from 'fs';
import { get } from 'https';

export function downloadVideos(
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
