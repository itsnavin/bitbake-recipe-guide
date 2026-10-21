import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home, meaningful search, filters, keyboard and empty state',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./');
  await expect(page.getByRole('heading',{name:/Understand the build/})).toBeVisible();
  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('searchbox').fill('checksum mismatch');
  await expect(page.locator('.result')).not.toHaveCount(0);
  await expect(page.locator('.result').filter({hasText:'Troubleshoot by symptom'})).toBeVisible();
  await page.getByRole('searchbox').fill('LIC_FILES_CHKSUM');
  await page.locator('#filter').selectOption('example');
  await expect(page.locator('.result')).toHaveCount(7);
  await page.getByRole('searchbox').fill('zzzz-unfindable');
  await expect(page.getByRole('heading',{name:'No matching entries'})).toBeVisible();
  await page.getByRole('button',{name:'Clear search & filters'}).click();
  await expect(page.locator('.result')).not.toHaveCount(0);
  expect(errors).toEqual([]);
});
test('deep-link reload, back navigation, responsive layout and menu',async({page},info)=>{
  await page.goto('./#/topic/assignments');
  await expect(page.getByRole('heading',{name:'Assignments, timing & exact whitespace'})).toBeVisible();
  await page.locator('.skip').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).toHaveURL(/#\/topic\/assignments$/);
  await page.reload();
  await expect(page.getByText('Parser fixture: weak default trap',{exact:true})).toBeVisible();
  await page.locator('.related a').first().click();
  await page.goBack();
  await expect(page.getByRole('heading',{name:'Assignments, timing & exact whitespace'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  if(info.project.name==='mobile'){
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveAttribute('aria-expanded','true');
    await page.locator('#sidebar a[href="#/examples"]').click();
    await expect(page.getByRole('heading',{name:'Recipe workshop',exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Menu',exact:true})).toHaveAttribute('aria-expanded','false');
  }
});
test('cleanup acknowledgement, clipboard failure and complete-file copying',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('Denied for test'))}}));
  await page.goto('./#/command/cleanall');
  const copy=page.getByRole('button',{name:'Copy',exact:true});
  await expect(copy).toBeDisabled();
  await expect(page.locator('.warning')).toContainText('shared');
  await page.getByRole('checkbox').check();
  await copy.click();
  await expect(page.getByText(/Clipboard unavailable/)).toBeVisible();
  await expect(page.getByRole('textbox',{name:'Manual copy text'})).toHaveValue('bitbake -c cleanall recipe-lab-hello\n');
  await page.goto('./#/example/recipe-lab-hello');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Copy file'}).click();
  const value=await page.getByRole('textbox',{name:'Manual copy text'}).inputValue();
  expect(value).toMatch(/^SUMMARY = /);
  expect(value.endsWith('\n')).toBeTruthy();
  expect(value).not.toMatch(/1SUMMARY|LINE 1/);
});
test('annotation links, source file selection and ZIP download',async({page})=>{
  await page.goto('./#/example/recipe-lab-cmake');
  await page.locator('.line-link').first().click();
  await expect(page.locator('#annotation-1')).toBeFocused();
  await page.getByRole('link',{name:'Read the underlying reference →'}).first().click();
  await expect(page.getByRole('heading',{name:'Recipe identity & descriptive metadata'})).toBeVisible();
  await page.goBack();
  await page.locator('#source-file').selectOption({label:'meta-recipe-lab/recipes-example/recipe-lab-cmake/recipe-lab-cmake/CMakeLists.txt'});
  await expect(page.locator('#example-source')).toContainText('cmake_minimum_required');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('link',{name:'Download complete example ↓'}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('recipe-lab-cmake.zip');
  expect(await download.failure()).toBeNull();
});
test('offline-ready copy includes deep routes and ZIP downloads',async({page,context})=>{
  await page.goto('./');
  await expect(page.locator('#offline-status')).toContainText('Offline copy ready',{timeout:30000});
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto('./#/topic/directories');
  await expect(page.getByRole('heading',{name:'S, B, WORKDIR, D & recipe sysroots'})).toBeVisible();
  const bytes=await page.evaluate(async()=>new Uint8Array(await (await fetch('./downloads/recipe-lab-all.zip')).arrayBuffer()).slice(0,4).join(','));
  expect(bytes).toBe('80,75,3,4');
});

test('key surfaces meet automated WCAG A/AA rules',async({page})=>{
  for(const route of ['', '#/topic/assignments', '#/command/cleanall', '#/example/recipe-lab-service', '#/coverage']) {
    await page.goto(`./${route}`);
    await expect(page.locator('main h1')).toBeVisible();
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(result.violations,`${route}: ${JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`).toEqual([]);
  }
});
