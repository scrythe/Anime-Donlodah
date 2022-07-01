import { download } from 'node-hls-downloader';

export async function hlsDownload(streamUrl: string, outputFile: string) {
  await download({
    quality: 'best',
    concurrency: 5,
    outputFile: outputFile,
    streamUrl: streamUrl,
  });
}
