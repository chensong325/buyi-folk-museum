import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('src');
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) {
      if (!file.includes('assets')) walk(file, out);
    } else if (/\.(tsx?|css)$/.test(name)) {
      out.push(file);
    }
  }
  return out;
}

let text = '';
for (const file of walk(root)) text += readFileSync(file, 'utf8');
text += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz·—…《》“”‘’：；，。！？、（）【】/％%+.布依风物志贵州民俗文化数字博物馆';
const characters = [...new Set([...text])].join('');

for (const weight of [400, 600]) {
  const input = readFileSync(`source-assets/fonts/noto-serif-sc-${weight}.woff2`);
  const output = await subsetFont(input, characters, { targetFormat: 'woff2' });
  writeFileSync(`src/assets/fonts/noto-serif-sc-${weight}-subset.woff2`, output);
  console.log(`${weight}: ${Math.round(output.length / 1024)} KB (${characters.length} glyphs)`);
}
