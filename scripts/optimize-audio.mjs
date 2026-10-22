import { readFileSync, writeFileSync } from 'node:fs';
import { MPEGDecoder } from 'mpg123-decoder';
import { Mp3Encoder } from '@breezystack/lamejs';

const source = '玖月花儿与筝 - 琵琶语 古筝版.mp3';
const target = 'public/audio/theme.mp3';
const input = new Uint8Array(readFileSync(source));
const decoder = new MPEGDecoder();
await decoder.ready;
const decoded = decoder.decode(input);
const channels = decoded.channelData.length > 1 ? 2 : 1;
const toInt16 = (samples) => {
  const output = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
};
const left = toInt16(decoded.channelData[0]);
const right = channels === 2 ? toInt16(decoded.channelData[1]) : null;
const encoder = new Mp3Encoder(channels, decoded.sampleRate, 128);
const chunks = [];
for (let i = 0; i < left.length; i += 1152) {
  const leftChunk = left.subarray(i, i + 1152);
  const rightChunk = right?.subarray(i, i + 1152);
  const encoded = rightChunk ? encoder.encodeBuffer(leftChunk, rightChunk) : encoder.encodeBuffer(leftChunk);
  if (encoded.length > 0) chunks.push(Buffer.from(encoded));
}
const tail = encoder.flush();
if (tail.length > 0) chunks.push(Buffer.from(tail));
decoder.free();
const output = Buffer.concat(chunks);
writeFileSync(target, output);
console.log(`Audio: ${Math.round(output.length / 1024 / 1024 * 100) / 100} MB`);
