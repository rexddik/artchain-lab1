import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { JSDOM } from 'jsdom';
import { parseAmount, validateNFTs } from '../src/model.js';

const root = new URL('../', import.meta.url);
const nativeFetch = globalThis.fetch;
const waitFor = async (condition, label) => {
  for (let i=0;i<300;i++) { if (condition()) return; await new Promise(r=>setTimeout(r,10)); }
  throw new Error(`Timeout: ${label}`);
};

test('Server API, disk persistence, concurrent bids, DOM forms, delegation, loading/error/retry', async () => {
  const temp=await mkdtemp(path.join(tmpdir(),'artchain-test-'));
  const database=path.join(temp,'db.json');
  await writeFile(database,await readFile(new URL('db.json',root)));
  let server;
  let base;
  const start=async()=>{
    server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'0',DB_FILE:database},stdio:['ignore','pipe','pipe']});
    let output='';server.stdout.on('data',chunk=>{output+=chunk;});server.stderr.on('data',chunk=>{output+=chunk;});
    await waitFor(()=>output.includes('ArtChain API:'),'API listening');
    base=output.match(/ArtChain API: (http:\/\/127\.0\.0\.1:\d+)/)[1];
  };
  const stop=async()=>{if(server&&server.exitCode===null){server.kill();await once(server,'exit');}};
  const call=(route,body)=>nativeFetch(base+route,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
  let dom;
  let moduleFile;
  try {
    await start();
    let response=await call('/nfts');assert.equal(response.status,200);
    let tokens=await response.json();assert.equal(tokens.length,15);validateNFTs(tokens);
    response=await call('/bids',{nftId:'1',bidder:'Устина',amount:.25});assert.equal(response.status,409);
    response=await call('/bids',{nftId:'1',bidder:'Устина',amount:'text'});assert.equal(response.status,400);
    response=await call('/bids',{nftId:'missing',bidder:'Устина',amount:1});assert.equal(response.status,404);
    const attempts=await Promise.all([call('/bids',{nftId:'1',bidder:'А',amount:.5}),call('/bids',{nftId:'1',bidder:'Б',amount:.5})]);
    assert.deepEqual(attempts.map(r=>r.status).sort(),[201,409]);
    let state=JSON.parse(await readFile(database,'utf8'));assert.equal(state.bids.length,1);assert.equal(state.nfts[0].price,.5);assert.equal(state.nfts[0].bids,13);
    await stop();await start();assert.equal((await (await call('/nfts/1')).json()).price,.5);
    response=await call('/nfts',{title:'Новый NFT',author:{name:'Устина'},price:1,image:'images/image 11.png',network:'Solana',category:'Живопись и графика'});assert.equal(response.status,201);const published=await response.json();assert.equal((await (await call('/nfts')).json())[0].id,published.id);
    dom=new JSDOM(await readFile(new URL('catalog.html',root),'utf8'),{url:'http://localhost/catalog.html',pretendToBeVisual:true});
    Object.assign(globalThis,{window:dom.window,document:dom.window.document,Element:dom.window.Element,FormData:dom.window.FormData});
    dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
    dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new dom.window.Event('close'));};
    let online=true, delayed=true, postCount=0;
    globalThis.fetch=async(url,options)=>{
      if(delayed) await new Promise(r=>setTimeout(r,60));
      if(!online) return new Response(JSON.stringify({error:'Тестовая ошибка сервера'}),{status:503,headers:{'Content-Type':'application/json'}});
      if(options?.method==='POST'&&String(url).endsWith('/bids')){postCount++;await new Promise(r=>setTimeout(r,80));}
      return nativeFetch(base+String(url).replace(/^\/api/,''),options);
    };
    const source=(await readFile(new URL('src/main.js',root),'utf8')).replace('import "./styles.scss";','');
    moduleFile=new URL(`src/.__test-main-${Date.now()}.mjs`,root);await writeFile(moduleFile,source);
    const imported=import(moduleFile.href);await waitFor(()=>document.querySelector('#load-status').textContent.includes('Загрузка'),'loading state');await imported;
    assert.equal(document.querySelectorAll('article.card').length,16);assert.equal(document.querySelector('#catalog-container').getAttribute('aria-busy'),'false');
    const button=document.querySelector('[data-action="bid"]');const nested=document.createElement('span');button.append(nested);nested.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));assert.ok(document.querySelector('#bid-dialog').open);
    const form=document.querySelector('[data-bid-form]');form.elements.bidder.value='Устина';form.elements.amount.value='2';
    const submit=()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
    submit();submit();assert.equal(form.querySelector('button[type=submit]').disabled,true);
    await waitFor(()=>form.querySelector('[data-form-status]').textContent.includes('принята'),'bid confirmation');
    await waitFor(()=>!form.querySelector('button[type=submit]').disabled,'bid done');assert.equal(postCount,1);assert.match(document.querySelector('article.card').textContent,/2 SOL/);assert.equal(document.querySelectorAll('article.card').length,16);
    const publication=document.querySelector('#publish-form');publication.elements.title.value='<b>Без HTML</b>';publication.elements.author.value='Устина';publication.elements.price.value='0.75';publication.elements.image.value='images/image 11.png';
    publication.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
    await waitFor(()=>document.querySelectorAll('article.card').length===17,'published card');assert.match(document.querySelector('article.card').textContent,/<b>Без HTML<\/b>/);assert.equal(document.querySelector('article.card b'),null);
    online=false;document.querySelector('#retry-load').click();await waitFor(()=>document.querySelector('#load-status').textContent.includes('Тестовая ошибка'),'HTTP error shown');assert.equal(document.querySelector('#retry-load').hidden,false);assert.equal(document.querySelector('#catalog-container').getAttribute('aria-busy'),'false');
    online=true;document.querySelector('#retry-load').click();await waitFor(()=>document.querySelector('#load-status').textContent==='','retry success');assert.equal(document.querySelector('#retry-load').hidden,true);
    const {request}=await import('../src/api.js');
    globalThis.fetch=async()=>{throw new TypeError('offline');};await assert.rejects(request('/nfts'),/подключиться/);
    globalThis.fetch=async()=>new Response('not JSON');await assert.rejects(request('/nfts'),/некорректный JSON/);
    assert.equal(parseAmount('0,5001'),.5001);assert.throws(()=>parseAmount('1.00001'));assert.throws(()=>parseAmount('0'));
    state=JSON.parse(await readFile(database,'utf8'));assert.equal(state.bids.length,2);assert.equal(state.nfts.length,17);
  } finally {
    globalThis.fetch=nativeFetch;dom?.window.close();if(moduleFile)await rm(moduleFile,{force:true});await stop();await rm(temp,{recursive:true,force:true});
  }
});
