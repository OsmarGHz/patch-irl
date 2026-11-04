import test from 'node:test';
import assert from 'node:assert/strict';
import {inputSchema,patchSchema,verifySchema,responseText,parseJSON} from '../lib/patch.ts';
test('accepts a local photo and rejects remote URLs, SVG, oversized context',()=>{
 const b={image:'data:image/jpeg;base64,/9j/AA==',budget:'reuse'};
 assert.equal(inputSchema.safeParse(b).success,true);
 for(const image of ['https://example.com/photo.jpg','data:image/svg+xml;base64,AAAA'])assert.equal(inputSchema.safeParse({...b,image}).success,false);
 assert.equal(inputSchema.safeParse({...b,context:'x'.repeat(1201)}).success,false);
});
test('extracts only visible output_text, never reasoning summaries',()=>{
 const response={output:[{type:'reasoning',summary:[{text:'not public output'}]},{type:'message',content:[{type:'output_text',text:'{"ok":true}'}]}]};
 assert.deepEqual(parseJSON(responseText(response)),{ok:true});
 assert.deepEqual(parseJSON('```json\n{"ok":true}\n```'),{ok:true});
});
test('rejects invented coordinates and missing safety information',()=>{
 const p={title:'Cable reset',summary:'Route cables behind the desk.',observations:['Loose cables'],uncertainty:'Cable condition unknown',minutes:15,costEstimate:'MX$0 using existing ties',materials:['Reusable ties'],steps:[{title:'Group cables',instruction:'Keep plugs accessible.',point:{x:50,y:70}}],successCheck:'No loose cables in leg space',safety:'Keep vents clear',imagePrompt:'Tidy the visible cables only',safeToDIY:true};
 assert.equal(patchSchema.safeParse(p).success,true);
 assert.equal(patchSchema.safeParse({...p,steps:[{...p.steps[0],point:{x:101,y:70}}]}).success,false);
 const {safeToDIY,...unsafe}=p;assert.equal(patchSchema.safeParse(unsafe).success,false);
});
test('verification cannot silently declare a certified repair',()=>{
 assert.equal(verifySchema.safeParse({status:'certified_safe',summary:'',checks:[],nextStep:''}).success,false);
 assert.equal(verifySchema.safeParse({status:'unclear',summary:'Different viewpoints',checks:[],nextStep:'Take a matching photo'}).success,true);
});

test('accepts the actual six-observation Spark response that exposed the original validation bug', async()=>{
 const fs=await import('node:fs/promises');
 const fixture=JSON.parse(await fs.readFile(new URL('./fixtures/spark-plan-six-observations.json',import.meta.url),'utf8'));
 assert.equal(fixture.observations.length,6);
 assert.equal(patchSchema.safeParse(fixture).success,true);
});

test('reads a constrained Chat Completions result without mixing in other response fields',()=>{
 assert.deepEqual(parseJSON(responseText({choices:[{message:{content:'{"safeToDIY":true}'},finish_reason:'stop'}]})),{safeToDIY:true});
});
