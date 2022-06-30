import { tmpdir } from 'os';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import chunkDownload from './chunkDownload';

function download(streamLink: string, _outPutPath: string) {
  const runID = Date.now();
  const segmetsDirLocation = join(tmpdir(), 'anime-donlodah');
  const segmetsDir = join(segmetsDirLocation, runID.toString());

  if (!existsSync(segmetsDirLocation)) mkdirSync(segmetsDirLocation);
  mkdirSync(segmetsDir);

  chunkDownload(streamLink, segmetsDir);
}

download(
  'https://delivery-node-juwayriyah.voe-network.net/hls/6oarndu64u23cszcr2fmz2l756r4kuookswdqmxgpyhlrfqcbh73jru5xutq/index-v1-a1.m3u8',
  '2'
);
