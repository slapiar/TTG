import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('AudioWorklet: PCM clips correctly, declares sample rate, batches and stays silent',()=>{
 let Processor;const messages=[];
 const sandbox={AudioWorkletProcessor:class{constructor(){this.port={postMessage:m=>messages.push(m)}}},sampleRate:48000,registerProcessor:(name,C)=>{assert.equal(name,'ttg-capture');Processor=C;},Float32Array,ArrayBuffer,DataView,Math};
 vm.runInNewContext(readFileSync(new URL('../assets/capture.js',import.meta.url),'utf8'),sandbox);
 const p=new Processor();const input=new Float32Array(2048);input.set([-2,-1,0,1,2]);
 assert.equal(p.process([[input]]),true);assert.equal(messages.length,1);assert.equal(messages[0].rate,48000);
 const view=new DataView(messages[0].bytes);assert.deepEqual([0,1,2,3,4].map(i=>view.getInt16(i*2,true)),[-32768,-32768,0,32767,32767]);
 assert.equal(p.process([]),true);assert.equal(messages.length,1);
});
