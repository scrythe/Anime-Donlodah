import { exec } from 'child_process';
import { writeFileSync } from 'fs';

export function mergeFiles(files: string[], outputFilePath: string) {
  const segmentsFile = 'ffmpeg-input.txt';
  const filePathList = files.map((file) => `file '${file}'\n`).join('');
  writeFileSync(segmentsFile, filePathList);

  exec(
    `ffmpeg -f concat -safe 0 -i "${segmentsFile}" -c copy "${outputFilePath}"`,
    (error) => {
      if (error) console.log(error);
      else console.log('download finished');
    }
  );
}
