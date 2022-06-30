import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirSync, existsSync, readdirSync } from 'fs';
import chunkDownload from './chunkDownload';
import { mergeFiles } from './utils';

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

  if (!existsSync(segmetsDirLocation)) mkdirSync(segmetsDirLocation);
  mkdirSync(segmetsDir);

  await chunkDownload(streamLink, segmetsDir);

  const segments = readdirSync(segmetsDir).map((file) =>
    join(segmetsDir, file)
  );
  segments.sort(sortByNumber);

  mergeFiles(segments, outputFilePath);
}

const streamLink =
  'https://delivery-node-juwayriyah.voe-network.net/hls/6oarndu64u23cszcr2fmz2l756r4kuookswdqmxgpyhlqurfcjrp25g6mrza/index-v1-a1.m3u8';
const outputFilePath = join(__dirname, 'download', 'video.ts');

download(streamLink, outputFilePath);
