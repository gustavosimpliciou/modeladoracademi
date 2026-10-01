import { build } from 'esbuild';
import { readdir, mkdir } from 'node:fs/promises';

const files = (await readdir('netlify/functions')).filter(f => f.endsWith('.js') && !f.startsWith('_'));
await mkdir('netlify/dist-functions', { recursive: true });
await build({ entryPoints: files.map(f => `netlify/functions/${f}`), outdir: 'netlify/dist-functions', bundle: true, platform: 'node', target: 'node22', format: 'cjs', outExtension: { '.js': '.cjs' }, loader: { '.sql': 'text' }, sourcemap: true });
console.log(`Bundled ${files.length} Netlify functions.`);
