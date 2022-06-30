import { createWriteStream, createReadStream, WriteStream } from 'fs';

function copyToStream(file: string, outStream: WriteStream) {
  const rs = createReadStream(file);
  rs.pipe(outStream, { end: false });
  return new Promise((resolve, reject) => {
    rs.on('end', resolve);
    rs.on('error', reject);
  });
}

export async function mergeFiles(
  files: string[],
  outputFile: string
): Promise<void> {
  const outStream = createWriteStream(outputFile);
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    if (!file) continue;
    await copyToStream(file, outStream);
  }
  outStream.end();
  return new Promise((resolve, reject) => {
    outStream.on('finish', resolve);
    outStream.on('error', reject);
  });
}
