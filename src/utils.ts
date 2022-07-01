import { download } from 'node-hls-downloader';

export function hlsDownload(streamUrl: string, outputFile: string) {
  download({
    quality: 'best',
    concurrency: 5,
    outputFile: outputFile,
    streamUrl: streamUrl,
  });
}
