import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirSync, existsSync, readdirSync } from 'fs';
import chunkDownload from './chunkDownload';
import { mergeFiles, convertToMp4 } from './utils';

function sortByNumber(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

async function download(_streamLink: string, outputFilePath: string) {
  const runID = Date.now();
  const segmetsDirLocation = join(tmpdir(), 'anime-donlodah');
  const segmetsDir = join(segmetsDirLocation, runID.toString());
  const mergedFile = join(segmetsDir, `${runID.toString()}.ts`);
  const outputFile = join(outputFilePath, `${runID.toString()}.mp4`);

  if (!existsSync(segmetsDirLocation)) mkdirSync(segmetsDirLocation);
  mkdirSync(segmetsDir);

  await chunkDownload(streamLink, segmetsDir);

  const segments = readdirSync(segmetsDir).map((file) =>
    join(segmetsDir, file)
  );
  segments.sort(sortByNumber);

  await mergeFiles(segments, mergedFile);
  await convertToMp4(mergedFile, outputFile);
}

const streamLink =
  'https://delivery-node-juwayriyah.voe-network.net/hls/6oarndu64u23cszcr2fmz2l756r4kuookswdqmxgpyhlqurfcjro2kw6mrza/index-v1-a1.m3u8';
const outputFilePath = join(__dirname, 'download');

download(streamLink, outputFilePath);
