import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '../assets');

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = createCrcTable();

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function toChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcBuffer = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function createSolidPng(width, height, hexColor) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hexColor)) {
    throw new Error(`Unsupported color format: ${hexColor}`);
  }

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0; // filter type None
  for (let x = 0; x < width; x++) {
    const offset = 1 + x * 3;
    row[offset] = r;
    row[offset + 1] = g;
    row[offset + 2] = b;
  }

  const raw = Buffer.alloc(row.length * height);
  for (let y = 0; y < height; y++) {
    row.copy(raw, y * row.length);
  }

  const pngSignature = Buffer.from('89504e470d0a1a0a', 'hex');
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type RGB
  header[10] = 0; // compression
  header[11] = 0; // filter
  header[12] = 0; // interlace

  const compressed = deflateSync(raw);

  return Buffer.concat([
    pngSignature,
    toChunk('IHDR', header),
    toChunk('IDAT', compressed),
    toChunk('IEND', Buffer.alloc(0)),
  ]);
}

function ensureAssetsDir() {
  mkdirSync(assetsDir, { recursive: true });
}

function writeAsset(name, buffer) {
  const target = resolve(assetsDir, name);
  writeFileSync(target, buffer);
  console.log(`Generated ${name}`);
}

ensureAssetsDir();

const assets = [
  { name: 'icon.png', width: 512, height: 512, color: '#1E6F9F' },
  { name: 'adaptive-icon.png', width: 512, height: 512, color: '#1E6F9F' },
  { name: 'splash.png', width: 1280, height: 720, color: '#F5F7FA' },
];

for (const asset of assets) {
  const buffer = createSolidPng(asset.width, asset.height, asset.color);
  writeAsset(asset.name, buffer);
}

console.log('All Expo placeholder assets generated.');
