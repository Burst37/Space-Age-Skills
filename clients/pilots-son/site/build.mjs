import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const R='/home/user/lumen/site';

/* copy guard runs FIRST. It exits non-zero on untraced or altered brand copy,
   which aborts the build before index.html is written. */
try {
  execFileSync('node',[`${R}/guard.mjs`],{stdio:'inherit'});
} catch {
  console.error('build aborted by copy guard - index.html not written');
  process.exit(1);
}

const P=fs.readdirSync(`${R}/parts`).filter(f=>f.endsWith('.html')).sort();
const rd=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
const css=P.map(f=>rd(`${R}/parts/${f.replace('.html','.css')}`)).join('\n');
const js =P.map(f=>rd(`${R}/parts/${f.replace('.html','.js')}`)).join('\n');
const body=P.map(f=>rd(`${R}/parts/${f}`)).join('\n');
const html=rd(`${R}/shell.html`)
  .replace('<!--FONTS-->',()=>`<style>${rd(`${R}/css/fonts.css`)}</style>`)
  .replace('<!--TOKENS-->',()=>`<style>${rd(`${R}/css/tokens.css`)}</style>`)
  .replace('<!--BASE-->',()=>`<style>${rd(`${R}/css/base.css`)}</style>`)
  .replace('<!--PARTCSS-->',()=>`<style>${css}</style>`)
  .replace('<!--BODY-->',()=>body)
  .replace('<!--PARTJS-->',()=>`<script>${js}<\/script>`);
fs.writeFileSync(`${R}/index.html`,html);
console.log('built',(html.length/1024).toFixed(0)+'kb','parts:',P.join(' '));
