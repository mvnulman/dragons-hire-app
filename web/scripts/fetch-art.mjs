// Sources the fleet artwork from the Wikimedia Commons public API.
//
// For each dragon it resolves a curated Commons file through the API, checks the
// license, downloads a 1400px rendition, crops it to the card aspect ratio,
// compresses it into public/dragons and writes the provenance metadata that
// feeds the /credits page.
//
// Run with: npm run art:fetch

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT =
  'DragonsHire/0.1 (development art pipeline; +https://github.com/mvnulman/dragons-hire-app)';

const ACCEPTED_LICENSES = /^(public domain|cc0|pd)/i;

const DRAGONS = [
  { slug: 'ignis', name: 'Ignis', file: 'AberdeenBestiaryFolio065vDragonDetail.jpg' },
  { slug: 'cinder', name: 'Cinder', file: 'Dragon Harley MS 3244.png' },
  { slug: 'pyrrha', name: 'Pyrrha', file: 'Sloane278 f.48v Elephants,Dragon,AndMandrake.jpg' },
  {
    slug: 'tempest',
    name: 'Tempest',
    file: "A dragon ca. 1270 Hugh of Fouilloy's Bestiary.jpg",
  },
  {
    slug: 'zephyr',
    name: 'Zephyr',
    file: 'Muhammad ibn Muhammad Shakir Ruzmah-\'i Nathani - Dragon of Tannin Island and Horned Rabit - Walters W659155B - Full Page.jpg',
  },
  {
    slug: 'nimbus',
    name: 'Nimbus',
    file: 'Ms. Ludwig XV 3 (83.MR.173), fol. 89 A Dragon, about 1270.jpg',
  },
  {
    slug: 'ferrum',
    name: 'Ferrum',
    file: 'Aurora consurgens zurich 044 f-21v-44 dragon-pot.jpg',
  },
  {
    slug: 'bastion',
    name: 'Bastion',
    file: 'Aurora consurgens zurich 073 f-36r-73 dragon-ground.jpg',
  },
  {
    slug: 'talos',
    name: 'Talos',
    file: 'Aurora consurgens zurich 042 f-20v-42 dragon-ring.jpg',
  },
  {
    slug: 'vesper',
    name: 'Vesper',
    file: 'Queen Mary Apocalypse - BL Royal MS 19 B XV f. 23 Beast and dragon.jpg',
  },
];

const HERO = {
  slug: 'hero',
  name: 'Hero',
  file: 'Dragon 3244.jpg',
  out: 'public/art/hero-dragons.jpg',
};

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

function stripHtml(value) {
  return (value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Some Commons records render as "<span>Unknown artist</span>Unknown artist",
 * which survives tag stripping as a doubled label.
 */
function cleanText(value, fallback) {
  let text = stripHtml(value);
  const doubled = text.match(/^(.{3,}?)\1$/);
  if (doubled) text = doubled[1];
  text = text.replace(/\s*Unknown (artist|author)\s*$/i, '').trim();
  return text || fallback;
}

function fileUrl(file) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;
}

async function api(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams({ action: 'query', format: 'json', ...params })}`;
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/json' },
  });

  if (response.status === 429 && attempt <= 4) {
    const wait = 4000 * attempt;
    console.log(`  rate limited, retrying in ${wait}ms (attempt ${attempt})`);
    await delay(wait);
    return api(params, attempt + 1);
  }

  if (!response.ok) throw new Error(`Commons API ${response.status}`);
  return response.json();
}

async function resolveArtwork(file) {
  const json = await api({
    titles: `File:${file}`,
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1400',
  });

  const page = Object.values(json.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];

  if (!info) throw new Error(`No imageinfo for File:${file}`);
  if (!info.mime?.startsWith('image/')) throw new Error(`Not an image: ${file}`);

  const meta = info.extmetadata ?? {};
  const license = cleanText(meta.LicenseShortName?.value, '');

  if (!ACCEPTED_LICENSES.test(license)) {
    throw new Error(`License "${license}" is not public domain for ${file}`);
  }

  return {
    title: cleanText(meta.ObjectName?.value, file.replace(/\.[a-z]+$/i, '')),
    artist: cleanText(meta.Artist?.value, 'Unknown artist'),
    license,
    sourceUrl: fileUrl(file),
    downloadUrl: info.thumburl ?? info.url,
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
  };
}

async function download(url, attempt = 1) {
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'image/*' },
  });

  if (response.status === 429 && attempt <= 4) {
    const wait = 4000 * attempt;
    console.log(`  rate limited, retrying in ${wait}ms (attempt ${attempt})`);
    await delay(wait);
    return download(url, attempt + 1);
  }

  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function convert(buffer, outPath, width, height) {
  const output = await sharp(buffer)
    .resize({ width, height, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, output);
  return Math.round(output.length / 1024);
}

async function main() {
  const credits = [];

  for (const dragon of DRAGONS) {
    console.log(`dragon ${dragon.slug}`);
    const artwork = await resolveArtwork(dragon.file);
    const buffer = await download(artwork.downloadUrl);
    const size = await convert(buffer, resolve(root, `public/dragons/${dragon.slug}.jpg`), 900, 650);

    console.log(`  ${artwork.title} — ${size} KB — ${artwork.license}`);
    credits.push({
      slug: dragon.slug,
      name: dragon.name,
      image: `/dragons/${dragon.slug}.jpg`,
      title: artwork.title,
      artist: artwork.artist,
      license: artwork.license,
      sourceUrl: artwork.sourceUrl,
    });

    await delay(1200);
  }

  console.log('hero');
  const heroArtwork = await resolveArtwork(HERO.file);
  const heroBuffer = await download(heroArtwork.downloadUrl);
  const heroSize = await convert(heroBuffer, resolve(root, HERO.out), 1600, 700);
  console.log(`  ${heroArtwork.title} — ${heroSize} KB — ${heroArtwork.license}`);
  credits.push({
    slug: HERO.slug,
    name: HERO.name,
    image: '/art/hero-dragons.jpg',
    title: heroArtwork.title,
    artist: heroArtwork.artist,
    license: heroArtwork.license,
    sourceUrl: heroArtwork.sourceUrl,
  });

  const manifestPath = resolve(root, 'src/content/art-credits.json');
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(credits, null, 2)}\n`);

  console.log(`\n${credits.length} artworks resolved and cached.`);
}

await main();
