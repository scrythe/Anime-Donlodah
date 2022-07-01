import axios from 'axios';

export function getM3u8Link(voeLink: string): Promise<string> {
  return new Promise(async (resolve) => {
    const res = await axios.get(voeLink);
    const m3u8LinkRegex = new RegExp('https(?<=https).*m3u8');
    const link = res.data.match(m3u8LinkRegex)[0];
    resolve(link);
  });
}
