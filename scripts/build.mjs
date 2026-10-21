import {mkdir, readFile, writeFile, cp, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {deflateRawSync} from 'node:zlib';
import {examples} from '../lib/examples.mjs';
import {baseline} from '../lib/sources.mjs';

const dist = new URL('../dist/', import.meta.url);
const root = new URL('../', import.meta.url);
await mkdir(dist, {recursive:true});
// No dependencies for ZIP creation: standard ZIP headers, CRC32 and raw DEFLATE.
function crc32(bytes) {
  let crc=0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
export function zip(files) {
  const local=[], central=[];
  let offset=0;
  for (const [path, data] of files) {
    const name=Buffer.from(path); const packed=deflateRawSync(data); const crc=crc32(data);
    const h=Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50); h.writeUInt16LE(20,4); h.writeUInt16LE(0x800,6);
    h.writeUInt16LE(8,8); h.writeUInt16LE(0x21,12); h.writeUInt32LE(crc,14);
    h.writeUInt32LE(packed.length,18); h.writeUInt32LE(data.length,22); h.writeUInt16LE(name.length,26);
    local.push(h,name,packed);
    const c=Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50); c.writeUInt16LE(0x314,4); c.writeUInt16LE(20,6);
    c.writeUInt16LE(0x800,8); c.writeUInt16LE(8,10); c.writeUInt16LE(0x21,14);
    c.writeUInt32LE(crc,16); c.writeUInt32LE(packed.length,20); c.writeUInt32LE(data.length,24);
    c.writeUInt16LE(name.length,28); c.writeUInt32LE((0o100644<<16)>>>0,38); c.writeUInt32LE(offset,42);
    central.push(c,name); offset+=h.length+name.length+packed.length;
  }
  const directory=Buffer.concat(central); const end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length,8); end.writeUInt16LE(files.length,10);
  end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
const exampleFiles={};
for (const file of new Set(examples.flatMap(e=>e.files))) {
  exampleFiles[file]=await readFile(new URL(file,root),'utf8');
}
await mkdir(new URL('lib/',dist),{recursive:true});
await mkdir(new URL('downloads/',dist),{recursive:true});
for (const path of ['index.html','assets','lib','examples']) {
  await cp(new URL(path,root),new URL(path,dist),{recursive:true});
}
await writeFile(new URL('lib/example-files.mjs',dist),`export const exampleFiles = ${JSON.stringify(exampleFiles)};\n`);
for (const item of examples) {
  const files=item.files.map(file=>[file.replace(/^examples\//,''),Buffer.from(exampleFiles[file])]);
  await writeFile(new URL(`downloads/${item.id}.zip`,dist),zip(files));
}
const allFiles=Object.entries(exampleFiles).map(([file,text])=>[file.replace(/^examples\//,''),Buffer.from(text)]);
await writeFile(new URL('downloads/recipe-lab-all.zip',dist),zip(allFiles));
await writeFile(new URL('manifest.webmanifest',dist),JSON.stringify({
  name:'BitBake Field Guide',short_name:'BitBake Guide',start_url:'./',scope:'./',display:'standalone',
  background_color:'#fafaf4',theme_color:'#123d35',
  icons:[{src:'./assets/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}],
},null,2));
await writeFile(new URL('.nojekyll',dist),'');
async function walk(path='') {
  const files=[];
  for (const item of await readdir(new URL(path,dist),{withFileTypes:true})) {
    const name=path+item.name;
    if (item.isDirectory()) files.push(...await walk(`${name}/`));
    else if (name!=='sw.js') files.push(name);
  }
  return files.sort();
}
const files=await walk();
const hash=createHash('sha256');
for (const file of files) {hash.update(file);hash.update(await readFile(new URL(file,dist)));}
const version=`bitbake-field-guide-${hash.digest('hex').slice(0,16)}`;
await writeFile(new URL('sw.js',dist),`const CACHE = ${JSON.stringify(version)};
const FILES = ${JSON.stringify(['./',...files.map(f=>`./${f}`)])};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('bitbake-field-guide-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(event.request, {ignoreSearch: true});
    if (hit) return hit;
    if (event.request.mode === 'navigate') return cache.match('./index.html');
    return fetch(event.request);
  })());
});
`);
console.log(`Built ${files.length+1} static files; ${examples.length} complete example ZIPs + all-layers ZIP. Baseline ${baseline.bitbake}.`);
