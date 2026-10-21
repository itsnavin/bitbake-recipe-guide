import {baseline, sources} from '../lib/sources.mjs';
import {topics} from '../lib/topics.mjs';
import {commands} from '../lib/commands.mjs';
import {examples} from '../lib/examples.mjs';
import {exampleFiles} from '../lib/example-files.mjs';

const $ = selector => document.querySelector(selector);
const main = $('#main');
const search = $('#search');
const filter = $('#filter');
const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const topicById = id => topics.find(topic => topic.id === id);
const tag = level => `<span class="tag ${level === 'advanced' ? 'advanced' : ''}">${level === 'advanced' ? 'Advanced' : 'Beginner friendly'}</span>`;
const crumb = (section, href) => `<div class="breadcrumb"><a href="#/">Field guide</a><span>/</span><a href="${href}">${escape(section)}</a></div>`;
const link = (id, label) => `<a href="#/topic/${id}">${escape(label || topicById(id)?.title || id)}</a>`;
const related = ids => `<h2>Keep exploring</h2><div class="related">${ids.map(id => link(id)).join('')}</div>`;
let blockIndex = 0;
function codeBlock(text, label = 'Terminal reference - commands are not executed', warning = '') {
  const id = `code-${++blockIndex}`;
  return `<section class="code-block" data-code-block><div class="code-header"><span>${escape(label)}</span><button type="button" data-copy="${id}" ${warning ? 'disabled' : ''}>Copy</button></div>${warning ? `<label class="ack"><input type="checkbox" data-ack="${id}"><span>I understand: ${escape(warning)}</span></label>` : ''}<pre id="${id}" tabindex="0"><code>${escape(text)}</code></pre><p class="copy-message" role="status"></p></section>`;
}
function sourceList(refs) {
  return `<section class="source-list"><h2>Primary sources · this edition</h2>${[...new Set(refs)].map(ref => `<a href="${sources[ref][1]}" target="_blank" rel="noreferrer">${escape(sources[ref][0])} ↗</a>`).join('')}<p>Reviewed ${baseline.reviewed} · Yocto ${baseline.yocto} · embedded BitBake ${baseline.bitbake}. Original explanations; sources remain authoritative.</p></section>`;
}
function table(headers, rows) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${escape(headers.join(', '))} table"><table><thead><tr>${headers.map(h => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => `<${i ? 'td' : 'th'} ${i ? '' : 'scope="row"'}>${escape(cell)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function header(title, summary, level, scope) {
  return `<header class="article-header"><div class="meta-row">${tag(level)}<span>${escape(scope)}</span></div><h1>${escape(title)}</h1><p>${escape(summary)}</p></header>`;
}
function home() {
  return `<section class="hero"><div><div class="eyebrow">THE RECIPE FOR BETTER RECIPES</div><h1>Understand the build.<br><em>Own your recipe.</em></h1><p>A practical field guide to BitBake commands, recipe syntax, and the little details that make a Yocto build work. Start simple. Go deep when you need to.</p><div class="hero-actions"><a class="button primary" href="#/topic/learning-path">Build your first recipe <span>↗</span></a><a class="button" href="#/commands">Explore commands <span>→</span></a></div></div><div class="terminal-card" aria-label="Preview of recipe metadata"><div class="terminal-title"><i></i><i></i><i></i><span>recipe-lab-hello_1.0.bb</span></div><pre tabindex="0"><code><span class="syntax-green">SUMMARY</span> = "A small C greeting program"
<span class="syntax-green">LICENSE</span> = "MIT"

<span class="syntax-green">SRC_URI</span> = "file://hello.c file://LICENSE"
<span class="syntax-green">S</span> = "\${WORKDIR}"

<span class="syntax-green">do_compile()</span> {
    \${CC} \${CPPFLAGS} \${CFLAGS} \\
        "\${S}/hello.c" \${LDFLAGS} -o "\${B}/hello"
}</code></pre><div class="terminal-foot">ILLUSTRATIVE EXCERPT · THE WORKSHOP HAS COMPLETE FILES</div></div></section>
    <div class="stats-row"><div class="stat"><strong>${commands.length}</strong><span>explained command operations</span></div><div class="stat"><strong>${topics.length}</strong><span>in-depth reference guides</span></div><div class="stat"><strong>${examples.length}</strong><span>annotated, downloadable examples</span></div><div class="stat"><strong>2.8.1</strong><span>BitBake · Scarthgap baseline</span></div></div>
    <section><div class="section-heading"><h2>Find your way around</h2><p>Less guesswork. More understanding.</p></div><div class="card-grid">
      <a class="card" href="#/commands"><span class="card-icon" aria-hidden="true">&gt;_</span><h3>Command explorer</h3><p>What it does, when to use it, what changes, and what to watch out for.</p><span class="card-footer">EXPLORE ${commands.length} OPERATIONS <span>↗</span></span></a>
      <a class="card" href="#/topics"><span class="card-icon" aria-hidden="true">{ }</span><h3>Syntax & metadata</h3><p>From assignment timing to overrides, task graphs, packaging, and cross-builds.</p><span class="card-footer">GO BEYOND THE SYNTAX <span>↗</span></span></a>
      <a class="card" href="#/examples"><span class="card-icon" aria-hidden="true">▤</span><h3>Recipe workshop</h3><p>Complete sources, real license hashes, and explanations next to the lines that matter.</p><span class="card-footer">OPEN ${examples.length} EXAMPLES <span>↗</span></span></a>
    </div></section>
    <section class="path-card"><div class="path-intro"><div class="eyebrow">NEW TO RECIPE WRITING?</div><h2>One small recipe.<br>A solid foundation.</h2><p>A guided path from an empty layer to a package in your image.</p><a href="#/topic/learning-path" class="button">Start the learning path <span>→</span></a></div><div class="steps"><div class="step"><strong>01 / UNDERSTAND</strong><h3>Meet the moving parts</h3><p>Layers, recipes, tasks. Know what belongs where.</p></div><div class="step"><strong>02 / MAKE</strong><h3>Build something small</h3><p>Source, license, compile, install. See the whole chain.</p></div><div class="step"><strong>03 / REFINE</strong><h3>Package with confidence</h3><p>Inspect outputs, fix QA, and add it to your image.</p></div></div></section>
    <div class="section-heading"><h2>At the build desk</h2><a href="#/topic/troubleshooting">Open troubleshooting →</a></div><div class="secondary-grid"><a class="related-app" href="#/topic/assignments">Why did my variable change?<span>Compare =, :=, ?=, ??= and override-style operations.</span></a><a class="related-app" href="#/topic/signatures">Why didn't my task rebuild?<span>Understand stamps, shared state and signature changes.</span></a></div>
    <div class="callout"><strong>Version-specific, by design.</strong> This edition targets Yocto 5.0.13 Scarthgap and its embedded BitBake 2.8.1. BitBake syntax, OE-Core conventions and board policy are labeled separately. <a href="#/coverage">See coverage & limitations.</a></div>`;
}
function renderTopic(item) {
  return `${crumb('Syntax & guides', '#/topics')}<article class="article">${header(item.title, item.summary, item.level, item.scope)}${item.blocks.map(block => {
    if (block.type === 'p') return `<p>${escape(block.text)}</p>`;
    if (block.type === 'code') return codeBlock(block.text, block.label, block.warning);
    if (block.type === 'note') return `<aside class="callout">${escape(block.text)}</aside>`;
    if (block.type === 'table') return table(block.headers, block.rows);
    if (block.type === 'quiz') return `<details><summary>Check your understanding: ${escape(block.question)}</summary><p class="quiz-answer">${escape(block.answer)}</p></details>`;
    return '';
  }).join('')}${related(item.related)}${sourceList(item.refs)}</article>`;
}
function renderCommand(item) {
  return `${crumb('Command explorer', '#/commands')}<article class="article">${header(item.title, item.summary, item.level, `${item.group} · terminal reference`)}<h2>Before you start</h2><p>${escape(item.prerequisites)}</p>${item.warning ? `<aside class="callout warning"><strong>Read before copying.</strong> ${escape(item.warning)}</aside>` : ''}${codeBlock(item.syntax, 'Example invocation - replace paths/targets as needed', item.warning)}<h2>What changes</h2><p>${escape(item.effects)}</p><h2>Read the result</h2><p>${escape(item.output)}</p><h2>Common traps & errors</h2><p>${escape(item.pitfalls)}</p>${related(item.related)}${sourceList(item.refs)}</article>`;
}
function renderExample(item, params) {
  const requested = params.get('file');
  const selected = item.files.includes(requested) ? requested : item.recipe;
  const recipeSelected = selected === item.recipe;
  const content = exampleFiles[selected];
  const annotations = recipeSelected ? item.annotations : [];
  const lines = content.trimEnd().split('\n').map((text, index) => {
    const line = index + 1;
    const annotated = annotations.some(a => a.line === line);
    const route = `#/example/${item.id}?line=${line}`;
    return `<span class="source-line"><span class="line-number" aria-hidden="true">${line}</span>${annotated ? `<a class="line-link" href="${route}" aria-label="Explain line ${line}: ${escape(text)}">${escape(text)}</a>` : escape(text)}</span>`;
  }).join('');
  return `${crumb('Recipe workshop', '#/examples')}<article class="article">${header(item.title, item.description, 'beginner', 'Complete supplied example · not a claimed OE build')}<div class="hero-actions"><a class="button primary" href="./downloads/${item.id}.zip" download>Download complete example ↓</a><a class="button" href="./downloads/recipe-lab-all.zip" download>Get both example layers ↓</a></div><div class="callout">Includes the source/build files and license text, not just a .bb snippet. Add the extracted layer with <strong>bitbake-layers add-layer</strong>; follow the <a href="#/topic/learning-path">learning path</a>. The optional append layer changes the hello greeting. The service needs a systemd distribution and stays disabled by default.</div><div class="file-selector"><label for="source-file">Inspect supplied file<select id="source-file" data-example="${item.id}">${item.files.map(file => `<option value="${escape(file)}" ${file === selected ? 'selected' : ''}>${escape(file.replace('examples/', ''))}</option>`).join('')}</select></label></div><div class="example-layout"><div class="example-code"><section class="code-block" data-code-block><div class="code-header"><span>${escape(selected.split('/').at(-1))} · complete file</span><button type="button" data-copy="example-source">Copy file</button></div><pre id="example-source" class="annotated-lines" tabindex="0" data-raw="${escape(content)}"><code>${lines}</code></pre><p class="copy-message" role="status"></p></section><div class="file-list"><h3>Download individual files</h3>${item.files.map(file => `<a href="./${file}" download>${escape(file.replace('examples/', ''))} ↓</a>`).join('')}</div></div><aside class="annotations" aria-label="Line explanations">${annotations.length ? annotations.map(a => `<section class="annotation-card" id="annotation-${a.line}" tabindex="-1"><strong>LINE ${a.line}</strong><p>${escape(a.text)}</p>${link(a.topic, 'Read the underlying reference →')}</section>`).join('') : '<section class="annotation-card"><strong>SUPPLIED SOURCE</strong><p>This is the actual file included in the download. Select the recipe above for line-by-line metadata explanations.</p></section>'}</aside></div>${related(['learning-path', 'licensing', 'build-systems', 'packaging'])}${sourceList(['recipes', 'classes', 'source'])}</article>`;
}
const records = [
  ...commands.map(item => ({...item, kind: 'command', href: `#/command/${item.id}`, body: [item.syntax,item.effects,item.output,item.pitfalls,item.prerequisites].join(' ')})),
  ...topics.map(item => ({...item, kind: 'topic', href: `#/topic/${item.id}`, body: JSON.stringify(item.blocks)})),
  ...examples.map(item => ({...item, kind: 'example', href: `#/example/${item.id}`, summary: item.description, level: 'beginner', body: item.files.map(file => exampleFiles[file]).join(' ')})),
];
const normalize = text => text.toLowerCase().replace(/[_:/=-]+/g, ' ').replace(/\s+/g, ' ').trim();
function results(query, selectedFilter, kind, group = '') {
  const terms = normalize(query).split(' ').filter(Boolean);
  return records.filter(item => {
    if (kind && item.kind !== kind) return false;
    if (group && item.group !== group) return false;
    if (selectedFilter !== 'all' && item.kind !== selectedFilter && item.level !== selectedFilter) return false;
    const text = normalize([item.title,item.summary,item.id,item.body].join(' '));
    return terms.every(term => text.includes(term));
  }).map(item => ({...item, score: terms.reduce((total, term) => total + (normalize(item.title).includes(term) ? 10 : 0) + (normalize(item.id).includes(term) ? 6 : 0) + (normalize(item.summary).includes(term) ? 3 : 0), 0)})).sort((a,b) => b.score-a.score);
}
function resultList(items) {
  if (!items.length) return `<div class="empty-state"><h2>No matching entries</h2><p>Try a task name (compile), variable (SRC_URI), or symptom (license, patch, stale). Remove the filter to search all sections.</p><button class="button" data-reset-search>Clear search & filters</button></div>`;
  return `<div class="result-list">${items.map(item => `<a class="result" href="${item.href}"><div class="result-head"><h2>${escape(item.title)}</h2><span class="tag">${escape(item.kind === 'topic' ? 'Guide' : item.kind === 'example' ? 'Recipe' : item.group)}</span></div><p>${escape(item.summary)}</p>${item.kind === 'command' ? `<code>${escape(item.syntax.split('\n')[0])}</code>` : `<span class="meta-row">${escape(item.level)}${item.scope ? ` · ${escape(item.scope)}` : ''}</span>`}</a>`).join('')}</div>`;
}
function catalog(kind, params) {
  const query = params.get('q') || '';
  const selectedFilter = params.get('filter') || 'all';
  const group = params.get('group') || '';
  const titles = {command: ['Command explorer', 'Look up an operation before you run it. Read its prerequisites, effects, output and risks.'], topic: ['Syntax & metadata', 'Understand why the recipe works, from the BitBake language to OE-Core packaging policy.'], example: ['Recipe workshop', 'Seven coherent examples, with source files, real license checksums and line-linked explanations.']};
  const [title, description] = titles[kind] || ['Search the field guide', 'Search command effects, syntax explanations, source files and troubleshooting, not just headings.'];
  const found = results(query, selectedFilter, kind, group);
  $('#search-status').textContent = `${found.length} matching entries`;
  return `${crumb(kind ? title : 'Search', '#/')}<header class="article-header"><div class="eyebrow">YOUR DESK REFERENCE</div><h1>${title}</h1><p>${description}</p></header>${kind === 'command' ? `<div class="chips" aria-label="Command groups">${['',...new Set(commands.map(c => c.group))].map(g => `<button class="chip" data-group="${g}" aria-pressed="${g === group}">${g || 'All operations'}</button>`).join('')}</div>` : ''}${kind === 'example' ? `<a class="button" href="./downloads/recipe-lab-all.zip" download>Download all examples as one ZIP ↓</a>` : ''}<p class="results-count">${found.length} ${found.length === 1 ? 'entry' : 'entries'}${query ? ` matching “${escape(query)}”` : ''}${selectedFilter !== 'all' ? ` · ${escape(selectedFilter)}` : ''}</p>${resultList(found)}`;
}
function coverage() {
  const rows = [
    ['Language', '= ?= ??= := += =+ .= =. :append :prepend :remove; expansion, quoting, continuations, overrides, functions, anonymous Python, export/unset', 'Deterministic examples checked with pinned BitBake parser'],
    ['Engine', 'Tasks/addtask/deltask, dependencies, varflags, stamps, signatures, setscene, force/invalidation', 'CLI compared to pinned main.py/help; not all engine flags cataloged'],
    ['OE metadata', 'Source/license, directories, dependencies, package splits, classes, native/nativesdk, image/machine/distro policy', 'Release-matched manuals/source; not a full configured Yocto build'],
    ['Operations', `${commands.length} explained operations across build/inspect/tasks/kernel/cleanup/layers/development`, 'Task availability depends on selected recipe/classes; discover with listtasks'],
    ['Examples', 'Six base recipes and one optional patch append; all supplied sources/build inputs', 'Checksums, coherent ZIPs, metadata syntax and native C/Make checks; no cross-build/boot claim'],
    ['Outside scope', 'Vendor BSP-specific variables, every class/fetcher, exhaustive kernel workflows, firmware redistribution decisions, release migration', 'Follow the matching official manuals and your BSP documentation'],
  ];
  return `${crumb('Coverage & sources', '#/')}<article class="article"><div class="eyebrow">THE FINE PRINT, UP FRONT</div><h1>One baseline. Clear boundaries.</h1><p>This is a curated learning and desk-reference app, not an exhaustive index of all present or future BitBake syntax. Explanations are original, with release-matched primary sources linked on each entry.</p>${table(['Edition', 'Pinned value'], [['Yocto/Poky', baseline.yocto],['Embedded BitBake', baseline.bitbake],['Poky checkout commit',baseline.commit],['Review date',baseline.reviewed],['Annotated tag object (not the commit)','529843b1c189ab7b133b7fdf197d4b2a4b71a6db']])}${table(['Area', 'Coverage', 'Evidence / limit'], rows)}<h2>How to read this guide</h2><p><strong>Reference snippets</strong> teach a pattern and can contain explicit placeholders. They are not standalone recipes. <strong>Complete supplied examples</strong> include matching sources, build files and licensing text. That label does not claim a full Yocto cross-build, image build, service runtime or hardware boot was performed.</p><h2>Offline, private, static</h2><p>There are no accounts, telemetry, external fonts, external runtime APIs, code evaluation or command execution. Search stays in your browser. After the offline indicator says ready, the guide, sources and ZIP downloads are cached for this browser. First load needs connectivity and service workers require HTTPS or localhost; private browsing, storage policies and eviction can prevent offline availability. External official sources still need a connection.</p><p>Links use hash routes, so deep links reload correctly on GitHub Pages without server rewrites. An update is activated only when you choose to reload, avoiding a silently mixed guide edition.</p><h2>Related tools, separate responsibilities</h2><div class="secondary-grid"><a class="related-app" href="https://itsnavin.github.io/yocto-rpi-builder/">Yocto Raspberry Pi builder ↗<span>Related machine/build planning app. Not modified or required by this guide.</span></a><a class="related-app" href="https://itsnavin.github.io/yocto-bbclass-generator/">Yocto bbclass generator ↗<span>Related class authoring app. Generated metadata still needs review against your release.</span></a></div>${sourceList(Object.keys(sources))}</article>`;
}
function route({focus = false} = {}) {
  const raw = location.hash.slice(1) || '/';
  const [path, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  const [, section, id] = path.split('/');
  blockIndex = 0;
  search.value = params.get('q') || '';
  filter.value = params.get('filter') || 'all';
  if (!filter.value) filter.value = 'all';
  let html;
  if (!section) html = home();
  else if (section === 'topic' && topicById(id)) html = renderTopic(topicById(id));
  else if (section === 'command' && commands.some(c => c.id === id)) html = renderCommand(commands.find(c => c.id === id));
  else if (section === 'example' && examples.some(e => e.id === id)) html = renderExample(examples.find(e => e.id === id), params);
  else if (['commands','topics','examples','search'].includes(section)) html = catalog({commands:'command',topics:'topic',examples:'example'}[section],params);
  else if (section === 'coverage') html = coverage();
  else html = '<h1>That entry is not in this edition.</h1><p>Use search or <a href="#/">return to the overview</a>. No commands were executed.</p>';
  main.innerHTML = html;
  document.title = `${main.querySelector('h1')?.textContent || 'BitBake Field Guide'} · BitBake Field Guide`;
  document.querySelectorAll('.sidebar nav a').forEach(a => {
    if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  if (focus) { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
  if (section === 'example' && /^\d+$/.test(params.get('line') || '')) {
    const annotation = $(`#annotation-${params.get('line')}`);
    if (annotation) {annotation.classList.add('is-active'); annotation.focus({preventScroll:true}); annotation.scrollIntoView({block:'center',behavior:'instant'});}
  }
  $('#sidebar').classList.remove('open');
  $('#nav-toggle').setAttribute('aria-expanded','false');
}
search.addEventListener('input', () => {
  const value = search.value;
  const params = new URLSearchParams();
  if (value.trim()) params.set('q', value.trim());
  if (filter.value !== 'all') params.set('filter', filter.value);
  const next=`#/search${params.size ? `?${params}` : ''}`;
  if(location.hash.startsWith('#/search')) history.replaceState(null,'',next);
  else history.pushState(null,'',next);
  blockIndex = 0;
  main.innerHTML = catalog(undefined, params);
  document.querySelectorAll('.sidebar [aria-current]').forEach(a=>a.removeAttribute('aria-current'));
  document.title = 'Search · BitBake Field Guide';
});
filter.addEventListener('change', () => {
  const params = new URLSearchParams();
  if (search.value.trim()) params.set('q',search.value.trim());
  if (filter.value !== 'all') params.set('filter',filter.value);
  location.hash = `/search${params.size ? `?${params}` : ''}`;
});
window.addEventListener('hashchange', () => route({focus:true}));
$('#nav-toggle').addEventListener('click', () => {
  const open = $('#sidebar').classList.toggle('open');
  $('#nav-toggle').setAttribute('aria-expanded',String(open));
});
$('.skip').addEventListener('click', event => {
  event.preventDefault();
  main.focus({preventScroll:true});
  main.scrollIntoView({block:'start',behavior:'instant'});
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
    event.preventDefault(); search.focus();
  }
  if (event.key === 'Escape' && $('#sidebar').classList.contains('open')) {
    $('#sidebar').classList.remove('open'); $('#nav-toggle').setAttribute('aria-expanded','false'); $('#nav-toggle').focus();
  }
});
main.addEventListener('change', event => {
  if (event.target.matches('[data-ack]')) {
    const button = main.querySelector(`[data-copy="${event.target.dataset.ack}"]`);
    button.disabled = !event.target.checked;
  }
  if (event.target.id === 'source-file') {
    location.hash = `/example/${event.target.dataset.example}?file=${encodeURIComponent(event.target.value)}`;
  }
});
main.addEventListener('click', async event => {
  const group = event.target.closest('[data-group]');
  if (group) { location.hash = `/commands${group.dataset.group ? `?group=${encodeURIComponent(group.dataset.group)}` : ''}`; return; }
  if (event.target.closest('[data-reset-search]')) { search.value=''; filter.value='all'; location.hash='/search'; return; }
  const button = event.target.closest('[data-copy]');
  if (!button || button.disabled) return;
  const block = button.closest('[data-code-block]');
  const source = document.getElementById(button.dataset.copy);
  const raw = source.hasAttribute('data-raw') ? source.dataset.raw : source.textContent;
  const text = raw.endsWith('\n') ? raw : `${raw}\n`;
  const status = block.querySelector('.copy-message');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    status.textContent = 'Copied. Review the command and placeholders before using it.';
  } catch {
    status.textContent = 'Clipboard unavailable. Select the text below and copy manually (Ctrl/Cmd+C).';
    let area = block.querySelector('textarea');
    if (!area) {
      const label = document.createElement('label'); label.className='manual-copy'; label.textContent='Manual copy text';
      area=document.createElement('textarea'); area.readOnly=true; area.rows=5; area.style.width='100%';
      label.append(area); block.append(label);
    }
    area.value=text; area.focus(); area.select();
  }
});
$('#command-count').textContent=String(commands.length).padStart(2,'0');
$('#topic-count').textContent=String(topics.length).padStart(2,'0');
route();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const status = $('#offline-status');
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      const ready = () => { status.textContent='Offline copy ready, including examples.'; };
      let updateRequested=false;
      const showUpdate = worker => {
        status.textContent='An updated edition is ready. ';
        const button=document.createElement('button'); button.className='update-button'; button.textContent='Reload to update';
        button.addEventListener('click',()=>{updateRequested=true; worker.postMessage({type:'ACTIVATE'});}); status.append(button);
      };
      if (registration.active) ready();
      else navigator.serviceWorker.ready.then(ready);
      if (registration.waiting) showUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const worker=registration.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) showUpdate(worker);
            else ready();
          }
          if (worker.state === 'redundant') status.textContent='Offline installation failed; retry online.';
        });
      });
      let reloading=false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (updateRequested && !reloading) {reloading=true; location.reload();}
      });
    } catch {
      status.textContent='Offline cache unavailable in this browser. The online guide still works.';
    }
  });
} else $('#offline-status').textContent='This browser does not support offline caching.';
