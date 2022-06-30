import axios from 'axios';
import PQueue from 'p-queue';
import { createWriteStream } from 'fs';
import { dirname, join, basename } from 'path';

async function getPlaylist(streamLink: string) {
  const response = await axios.get(streamLink);
  return response.data as string;
}

function getSegments(playlist: string, streamLink: string) {
  const lines = playlist.split(/\r?\n/);
  const playlistUrl = dirname(streamLink);
  const segments = lines.filter((line) => line.endsWith('.ts'));
  return segments.map((uri) => new URL(uri, `${playlistUrl}/`).href);
}

async function downloadSegment(uri: string, segmentsDir: string) {
  const filename = basename(uri);
  const filePath = join(segmentsDir, filename);
  console.log(filePath);
  const file = createWriteStream(filePath);
  const request = await axios(uri, { responseType: 'stream' });
  const stream = request.data.pipe(file);
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function chunkDownload(streamLink: string, segmentsDir: string) {
  const playlist = await getPlaylist(streamLink);
  const segments = getSegments(playlist, streamLink);
  const queue = new PQueue({ concurrency: 5 });
  segments.forEach((uri) => queue.add(() => downloadSegment(uri, segmentsDir)));
}

export default chunkDownload;
