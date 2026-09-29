const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const output = path.resolve(__dirname, '../public');
  const mark = await sharp(process.argv[2], { density: 144 }).trim().png().toBuffer();
  async function canvas(width, height, inset) {
    const image = await sharp(mark).resize(width - inset * 2, height - inset * 2, { fit: 'inside' }).toBuffer();
    return sharp({ create: { width, height, channels: 4, background: '#051341' } })
      .composite([{ input: image, gravity: 'centre' }]);
  }
  await (await canvas(1200, 630, 115)).jpeg({ quality: 95 }).toFile(path.join(output, 'og-image.jpg'));
  for (const size of [32, 48, 180, 192, 512]) {
    await (await canvas(size, size, Math.round(size * 0.1))).png().toFile(path.join(output, `icon-${size}.png`));
  }
  // ICO supports embedded PNG frames; include small and larger browser sizes.
  const frames = await Promise.all([32, 48].map(size => fs.readFile(path.join(output, `icon-${size}.png`))));
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach((frame, i) => {
    const start = 6 + i * 16;
    header[start] = header[start + 1] = [32, 48][i];
    header.writeUInt16LE(1, start + 4);
    header.writeUInt16LE(32, start + 6);
    header.writeUInt32LE(frame.length, start + 8);
    header.writeUInt32LE(offset, start + 12);
    offset += frame.length;
  });
  await fs.writeFile(path.join(output, 'favicon.ico'), Buffer.concat([header, ...frames]));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
