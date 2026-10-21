import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {topics} from '../lib/topics.mjs';
import {commands} from '../lib/commands.mjs';
import {examples} from '../lib/examples.mjs';
import {baseline,sources} from '../lib/sources.mjs';

test('unique stable IDs, real cross references and primary sources on every entry',()=>{
  for(const records of [topics,commands,examples]) {
    assert.equal(new Set(records.map(r=>r.id)).size,records.length);
    for(const record of records) assert.match(record.id,/^[a-z][a-z0-9-]+$/);
  }
  for(const item of [...topics,...commands]) {
    assert.ok(item.refs.length);
    for(const ref of item.refs) assert.ok(sources[ref],`${item.id}: source ${ref}`);
    for(const ref of item.related) assert.ok(topics.some(t=>t.id===ref),`${item.id}: topic ${ref}`);
  }
  assert.equal(baseline.bitbake,'2.8.1');
  assert.equal(baseline.commit,'f16cffd030d21d12dd57bb95cfc310bda41f8a1f');
});
test('required operator coverage and substantive command fields',()=>{
  const syntax=JSON.stringify(topics.find(t=>t.id==='assignments'));
  for(const operator of ['?=','??=',':=','+=','=+','.=','=.',':append',':prepend',':remove']) assert.ok(syntax.includes(operator),operator);
  for(const c of commands) {
    for(const field of ['summary','effects','output','pitfalls','prerequisites']) assert.ok(c[field].length>45,`${c.id}.${field}`);
  }
  for(const id of ['clean','cleansstate','cleanall','devtool-reset']) assert.ok(commands.find(c=>c.id===id).warning);
  for(const id of ['listtasks','force','invalidate','parse','environment','graph','dryrun','diffsigs','fetch','unpack','patch','configure','compile','install','package','rootfs','menuconfig','diffconfig','check-layer','pkgdata']) assert.ok(commands.some(c=>c.id===id),id);
});
test('complete examples have actual files, matching license hashes and valid line annotations',async()=>{
  for(const example of examples) {
    assert.ok(example.files.includes(example.recipe));
    const recipe=await readFile(example.recipe,'utf8');
    const lines=recipe.trimEnd().split('\n');
    for(const a of example.annotations) {
      assert.ok(a.line>=1 && a.line<=lines.length,`${example.id}: line ${a.line}`);
      assert.ok(topics.some(t=>t.id===a.topic),a.topic);
      assert.ok(lines[a.line-1].trim(),`${example.id}: blank annotation ${a.line}`);
    }
    for(const file of example.files) {
      assert.ok((await stat(file)).isFile(),file);
      const bytes=await readFile(file);
      assert.equal(bytes.at(-1),10,`final LF: ${file}`);
      assert.ok(!bytes.includes(13),`unexpected CRLF: ${file}`);
    }
    if(example.recipe.endsWith('.bb')) {
      const match=recipe.match(/LIC_FILES_CHKSUM = "file:\/\/LICENSE;md5=([a-f0-9]{32})"/);
      assert.ok(match,example.recipe);
      const license=example.files.find(f=>f.endsWith('/LICENSE'));
      assert.equal(createHash('md5').update(await readFile(license)).digest('hex'),match[1]);
      for(const [,name] of recipe.matchAll(/file:\/\/([\w.-]+)(?:[ ;"])/g)) {
        assert.ok(example.files.some(file=>file.endsWith(`/${name}`)),`${example.id}: missing ${name}`);
      }
      assert.ok(!recipe.includes('UNPACKDIR'),'Scarthgap unpack behavior');
      assert.ok(!recipe.includes('INSANE_SKIP'),'no QA blanket bypass');
    }
  }
  const data=await readFile(examples.find(e=>e.id==='recipe-lab-data').recipe,'utf8');
  assert.match(data,/FILES:\$\{PN\}.*datadir/);
});
test('built offline manifest, download coverage and internal route links',async()=>{
  const html=await readFile('dist/index.html','utf8');
  const app=await readFile('dist/assets/app.mjs','utf8');
  const sw=await readFile('dist/sw.js','utf8');
  for(const [,kind,id] of [...html.matchAll(/href="#\/(topic|command|example)\/([\w-]+)"/g),...app.matchAll(/href="#\/(topic|command|example)\/([\w-]+)"/g)]) {
    const list={topic:topics,command:commands,example:examples}[kind];
    assert.ok(list.some(item=>item.id===id),`${kind}/${id}`);
  }
  for(const item of examples) {
    const file=`downloads/${item.id}.zip`;
    assert.ok((await stat(path.join('dist',file))).size>500);
    assert.ok(sw.includes(file),`offline ${file}`);
    for(const file of item.files) assert.ok(sw.includes(file),`offline ${file}`);
  }
  assert.ok(sw.includes('recipe-lab-all.zip'));
  assert.ok(!html.includes('https://fonts.'));
  assert.ok(html.includes('Content-Security-Policy'));
});
test('all displayed parser-fixture blocks correspond to actual checked inputs',async()=>{
  const fixtures=JSON.parse(await readFile('tests/parser-fixtures.json','utf8'));
  const blocks=topics.flatMap(t=>t.blocks).filter(b=>b.type==='code' && b.label?.startsWith('Parser fixture'));
  for(const block of blocks) {
    const statements=block.text.split('\n').filter(line=>!line.trimStart().startsWith('#')).join('\n').trim();
    // One priority block contains both the single-override and combined cases.
    assert.ok(fixtures.some(f=>f.text.trim()===statements || statements.startsWith(f.text.trim())),block.label);
  }
});
