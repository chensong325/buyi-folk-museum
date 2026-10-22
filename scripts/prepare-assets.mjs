import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('source-assets/images/original');
const output = path.resolve('public/images');
await mkdir(output, { recursive: true });

for (let i = 1; i <= 14; i += 1) {
  const sourceWidth = i === 1 ? 876 : 1400;
  await sharp(path.join(source, `image${i}.png`))
    .rotate()
    .resize({ width: sourceWidth, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(output, `image${i}.webp`));
}

const crop = async (name, sourceName, left, top, width, height) => {
  const input = path.join(source, sourceName);
  const meta = await sharp(input).metadata();
  const x = Math.max(0, Math.round((meta.width ?? 1) * left));
  const y = Math.max(0, Math.round((meta.height ?? 1) * top));
  const w = Math.min((meta.width ?? 1) - x, Math.round((meta.width ?? 1) * width));
  const h = Math.min((meta.height ?? 1) - y, Math.round((meta.height ?? 1) * height));
  await sharp(input)
    .extract({ left: x, top: y, width: w, height: h })
    .resize({ width: 1000, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(output, `${name}.webp`));
};

await Promise.all([
  crop('process-detail-a', 'image2.png', 0.48, 0, 0.52, 1),
  crop('process-detail-b', 'image3.png', 0, 0.12, 1, 0.76),
  crop('pattern-detail', 'image4.png', 0.2, 0.16, 0.62, 0.68),
  crop('costume-detail-a', 'image5.png', 0, 0, 0.46, 1),
  crop('costume-detail-b', 'image5.png', 0.5, 0, 0.5, 1),
  crop('instrument-detail-a', 'image6.png', 0, 0, 0.54, 1),
  crop('instrument-detail-b', 'image6.png', 0.52, 0, 0.48, 1),
  crop('opera-detail', 'image7.png', 0, 0.16, 1, 0.7),
  crop('chabai-detail', 'image9.png', 0, 0.12, 1, 0.76),
  crop('festival-detail', 'image10.png', 0.08, 0.08, 0.72, 0.84),
  crop('food-detail', 'image11.png', 0.18, 0.1, 0.7, 0.82),
  crop('geography-detail', 'image13.png', 0.42, 0.06, 0.56, 0.88),
]);

const baseImages = (await readdir(output)).filter((file) => file.endsWith('.webp') && !/-(480|960)\.webp$/.test(file));
for (const file of baseImages) {
  const input = path.join(output, file);
  for (const width of [480, 960]) {
    const target = path.join(output, file.replace(/\.webp$/, `-${width}.webp`));
    await sharp(input)
      .resize({ width, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 78, effort: 6 })
      .toFile(target);
  }
}
console.log(`Generated ${baseImages.length} responsive image sets`);
