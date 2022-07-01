import { download } from 'node-hls-downloader';

function hlsDownload(streamUrl: string, outputFile: string) {
  download({
    quality: 'best',
    concurrency: 5,
    outputFile: outputFile,
    streamUrl: streamUrl,
  });
}

hlsDownload(
  'https://delivery-node-awad.voe-network.net/hls/,6oarnvheum33cszcr345fpzsx4rcs3k7i2a4g7uesztta7imbrbbmteoaiga,.urlset/master.m3u8',
  'download/yeet.mp4'
);
