import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = fs.readFileSync(path.join(__dirname, 'toradora_episode_8.html'));
const $ = cheerio.load(data);
let getElementText = "document.getElementById('robotlink').innerHTML";
let scriptTag = $(`script:contains(${getElementText})`).html();
console.log(scriptTag);
let scriptTagBeginning = scriptTag.indexOf(getElementText);
let scriptTagEnding = scriptTag.lastIndexOf(';');
let scriptTagFunction = scriptTag.substring(
  scriptTagBeginning,
  scriptTagEnding
);
console.log(scriptTagFunction);
