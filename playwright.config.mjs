import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  use:{baseURL:'http://127.0.0.1:4173/bitbake-recipe-guide/',browserName:'chromium'},
  webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173/bitbake-recipe-guide/',reuseExistingServer:!process.env.CI},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  ],
});
