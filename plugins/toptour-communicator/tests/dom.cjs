const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {JSDOM}=require(process.env.TTG_CHECK_MODULES?process.env.TTG_CHECK_MODULES+'/jsdom':'jsdom');
const base=path.resolve(__dirname,'..');
function fixture(){const panel=fs.readFileSync(path.join(base,'panel.php'),'utf8').split('\n').slice(1).join('\n');const dom=new JSDOM(panel,{url:'https://ttg.test/',runScripts:'outside-only'});const w=dom.window;const sent=[];
 w.TTGVoice={api:'https://ttg.test/api/',worklet:'/capture.js',position:'right'};w.fetch=async(url,opts)=>{const route=url.split('/').pop();sent.push({route,data:JSON.parse(opts.body)});return{ok:true,json:async()=>({session:'a'.repeat(64),text:'Termín a množstvo?',id:42})};};w.eval(fs.readFileSync(path.join(base,'assets/widget.js'),'utf8'));return{dom,w,sent,$:s=>w.document.querySelector(s)};}
const tick=()=>new Promise(r=>setTimeout(r,0));
test('UI: consent gate, text transcript, minimize preserves state and confirmed enquiry',async()=>{const f=fixture(),{$,w,sent}=f;try{
 $('.ttgv-launch').click();assert.equal($('#ttgv-panel').hidden,false);
 $('.ttgv-text textarea').value='Program pre hotel';$('.ttgv-text').dispatchEvent(new w.Event('submit',{cancelable:true}));await tick();assert.equal(sent.length,0);
 $('.ttgv-consent input').checked=true;$('.ttgv-text').dispatchEvent(new w.Event('submit',{cancelable:true}));await tick();assert.deepEqual(sent.map(x=>x.route),['session','text']);assert.match($('.ttgv-log').textContent,/Termín/);
 $('.ttgv-min').click();assert.equal($('#ttgv-panel').hidden,true);$('.ttgv-launch').click();assert.match($('.ttgv-log').textContent,/Program pre hotel/);
 $('.ttgv-language').click();assert.equal($('.ttgv-languages').hidden,false);$('.ttgv-write').click();assert.match($('.ttgv-status').textContent,/Prepáčte/);
 $('input[name=email]').value='hotel@example.com';$('textarea[name=message]').value='Ponuka';$('input[name=confirmed]').checked=true;
 $('.ttgv-inquiry form').dispatchEvent(new w.Event('submit',{cancelable:true}));await tick();assert.match($('.ttgv-status').textContent,/#42/);assert.equal(sent.at(-1).data.confirmed,true);assert.equal(sent.at(-1).data.transcript.length,2);
 $('.ttgv-inquiry form').dispatchEvent(new w.Event('submit',{cancelable:true}));await tick();assert.equal(sent.filter(x=>x.route==='inquiry').length,1);
 }finally{w.close();}});
test('UI: stopping while microphone permission is pending releases late stream',async()=>{const f=fixture(),{$,w}=f;try{
 let release,stopped=0,closed=0;w.AudioContext=class{resume(){return Promise.resolve()}close(){closed++;return Promise.resolve()}};w.AudioWorkletNode=class{};
 Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:()=>new Promise(r=>release=r)}});
 $('.ttgv-consent input').checked=true;$('.ttgv-call').click();await tick();assert.ok(release);$('.ttgv-stop').click();release({getTracks:()=>[{stop:()=>stopped++}]});await tick();assert.equal(stopped,1);assert.ok(closed>=1);assert.equal($('.ttgv-call').disabled,false);
 }finally{w.close();}});
test('Live: constrained socket, declared PCM rate, barge-in, two-stage fallback',async()=>{const f=fixture(),{$,w}=f;try{
 const sockets=[],timers=new Map();let tid=0,stops=0,tracks=0,capture;
 w.setTimeout=(fn,ms)=>{const id=++tid;timers.set(id,{fn,ms});return id};w.clearTimeout=id=>timers.delete(id);
 w.fetch=async(url)=>({ok:true,json:async()=>url.endsWith('session')?{session:'b'.repeat(64)}:{token:'auth_tokens/example',model:'models/gemini-3.8-live',seconds:450}});
 w.AudioContext=class{currentTime=0;destination={};resume(){return Promise.resolve()}close(){return Promise.resolve()}audioWorklet={addModule:async()=>{}};createMediaStreamSource(){return{connect(){},disconnect(){}}}createGain(){return{gain:{},connect(){},disconnect(){}}}createBuffer(c,n){return{duration:n/24000,getChannelData:()=>new Float32Array(n)}}createBufferSource(){return{connect(){},start(){},stop(){stops++}}}};
 w.AudioWorkletNode=class{constructor(){this.port={};capture=this}connect(){}disconnect(){}};
 Object.defineProperty(w.navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>tracks++}]})}});
 w.WebSocket=class{static OPEN=1;readyState=1;bufferedAmount=0;sent=[];constructor(url){this.url=url;sockets.push(this)}send(v){this.sent.push(JSON.parse(v))}close(){} };
 $('.ttgv-consent input').checked=true;$('.ttgv-call').click();await tick();assert.equal(sockets.length,1);const ws=sockets[0];assert.match(ws.url,/BidiGenerateContentConstrained\?access_token=/);ws.onopen();await ws.onmessage({data:JSON.stringify({setupComplete:{}})});
 capture.port.onmessage({data:{bytes:new Uint8Array([0,0]).buffer,rate:48000}});assert.equal(ws.sent.at(-1).realtimeInput.audio.mimeType,'audio/pcm;rate=48000');
 await ws.onmessage({data:JSON.stringify({serverContent:{modelTurn:{parts:[{inlineData:{data:'AAAAAA=='}}]}}})});
 await ws.onmessage({data:JSON.stringify({serverContent:{interrupted:true}})});assert.equal(stops,1);
 // Model greeting must not cancel the timeout waiting for the visitor's first recognized words.
 await ws.onmessage({data:JSON.stringify({serverContent:{outputTranscription:{text:'Vitajte.'},turnComplete:true}})});
 const timer=[...timers.values()].find(t=>t.ms===20000);assert.ok(timer);timer.fn();assert.equal($('.ttgv-languages').hidden,false);
 $('.ttgv-languages select').value='es';$('.ttgv-retry').click();await tick();const second=sockets.at(-1);second.onopen();await second.onmessage({data:JSON.stringify({setupComplete:{}})});
 [...timers.values()].find(t=>t.ms===20000).fn();assert.equal($('.ttgv-languages').hidden,true);assert.match($('.ttgv-status').textContent,/Prepáčte/);assert.ok(tracks>=2);
 }finally{w.close();}});
