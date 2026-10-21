import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.zip':'application/zip'};
const prefix='/bitbake-recipe-guide';
http.createServer(async (req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if (url.pathname===prefix) {res.writeHead(302,{Location:`${prefix}/`});res.end();return;}
    let pathname=decodeURIComponent(url.pathname);
    if (pathname.startsWith(`${prefix}/`)) pathname=pathname.slice(prefix.length);
    const resolved=path.resolve(root,`.${pathname}`);
    if (resolved!==root && !resolved.startsWith(`${root}${path.sep}`)) {res.writeHead(403);res.end('Forbidden');return;}
    const info=await stat(resolved);
    const file=info.isDirectory()?path.join(resolved,'index.html'):resolved;
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain; charset=utf-8','Cache-Control':'no-cache'});
    res.end(data);
  } catch (error) {
    res.writeHead(error.code==='ENOENT'?404:500,{'Content-Type':'text/plain'});
    res.end(error.code==='ENOENT'?'Not found':'Server error');
    if (error.code!=='ENOENT') console.error(error);
  }
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}${prefix}/`));
