import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
async function normalize(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) await normalize(file);
    else await writeFile(file,(await readFile(file,'utf8')).replace(/\r\n/g,'\n'));
  }
}
await normalize('examples');
// These examples intentionally share identical supplied MIT text.
const license=await readFile('examples/meta-recipe-lab/recipes-example/recipe-lab-hello/recipe-lab-hello/LICENSE');
const md5=createHash('md5').update(license).digest('hex');
async function hashes(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) await hashes(file);
    else if(file.endsWith('.bb')) await writeFile(file,(await readFile(file,'utf8')).replace(/file:\/\/LICENSE;md5=[a-f0-9]{32}/g,`file://LICENSE;md5=${md5}`));
  }
}
await hashes('examples');
console.log(`Normalized supplied examples to LF; license md5 ${md5}. Review license changes before committing.`);
