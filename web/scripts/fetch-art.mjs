// Downloads public-domain medieval dragon illuminations from Wikimedia Commons,
// crops them to the card aspect ratio and compresses them into public/.
//
// Run with: node scripts/fetch-art.mjs
// The images are Public Domain (see ART_CREDITS in the README).

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const USER_AGENT =
  'DragonsHire/0.1 (development seed script; +https://github.com/mvnulman/dragons-hire-app)';

const DRAGONS = [
  {
    slug: 'ignis',
    source: 'https://upload.wikimedia.org/wikipedia/commons/3/36/AberdeenBestiaryFolio065vDragonDetail.jpg',
  },
  {
    slug: 'cinder',
    source: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Dragon_Harley_MS_3244.png',
  },
  {
    slug: 'pyrrha',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Sloane278_f.48v_Elephants%2CDragon%2CAndMandrake.jpg',
  },
  {
    slug: 'tempest',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/A_dragon_ca._1270_Hugh_of_Fouilloy%27s_Bestiary.jpg/1280px-A_dragon_ca._1270_Hugh_of_Fouilloy%27s_Bestiary.jpg',
  },
  {
    slug: 'zephyr',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Muhammad_ibn_Muhammad_Shakir_Ruzmah-%27i_Nathani_-_Dragon_of_Tannin_Island_and_Horned_Rabit_-_Walters_W659155B_-_Full_Page.jpg',
  },
  {
    slug: 'nimbus',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Ms._Ludwig_XV_3_%2883.MR.173%29%2C_fol._89_A_Dragon%2C_about_1270.jpg/1280px-Ms._Ludwig_XV_3_%2883.MR.173%29%2C_fol._89_A_Dragon%2C_about_1270.jpg',
  },
  {
    slug: 'ferrum',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Aurora_consurgens_zurich_044_f-21v-44_dragon-pot.jpg/1280px-Aurora_consurgens_zurich_044_f-21v-44_dragon-pot.jpg',
  },
  {
    slug: 'bastion',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Aurora_consurgens_zurich_073_f-36r-73_dragon-ground.jpg/1280px-Aurora_consurgens_zurich_073_f-36r-73_dragon-ground.jpg',
  },
  {
    slug: 'talos',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Aurora_consurgens_zurich_042_f-20v-42_dragon-ring.jpg/1280px-Aurora_consurgens_zurich_042_f-20v-42_dragon-ring.jpg',
  },
  {
    slug: 'vesper',
    source:
      'https://upload.wikimedia.org/wikipedia/commons/e/e1/Queen_Mary_Apocalypse_-_BL_Royal_MS_19_B_XV_f._23_Beast_and_dragon.jpg',
  },
];

const HERO = {
  out: 'public/art/hero-dragons.jpg',
  source:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Dragon_3244.jpg/1280px-Dragon_3244.jpg',
};

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

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

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

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
  for (const dragon of DRAGONS) {
    const outPath = resolve(root, `public/dragons/${dragon.slug}.jpg`);
    console.log(`dragon ${dragon.slug}`);
    const buffer = await download(dragon.source);
    const size = await convert(buffer, outPath, 900, 650);
    console.log(`  -> ${size} KB`);
    await delay(1500);
  }

  console.log('hero');
  const heroBuffer = await download(HERO.source);
  const heroSize = await convert(heroBuffer, resolve(root, HERO.out), 1600, 700);
  console.log(`  -> ${heroSize} KB`);
}

await main();
