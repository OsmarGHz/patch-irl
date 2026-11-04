import { z } from 'zod';
export const pointSchema = z.object({ x:z.number().min(0).max(100), y:z.number().min(0).max(100) });
export const patchSchema = z.object({
 title:z.string().min(3).max(100), summary:z.string().max(500),
 observations:z.array(z.string().max(240)).min(1).max(12),
 uncertainty:z.string().max(400),
 minutes:z.number().int().min(1).max(480),
 costEstimate:z.string().max(120),
 materials:z.array(z.string().max(120)).max(8),
 steps:z.array(z.object({title:z.string().max(100),instruction:z.string().max(400),point:pointSchema})).min(1).max(5),
 successCheck:z.string().max(400), safety:z.string().max(400),
 imagePrompt:z.string().max(1800), safeToDIY:z.boolean()
});
export type Patch = z.infer<typeof patchSchema>;
export type Receipt = {model:string;responseId:string;elapsedMs:number;createdAt:string};
export type Result = {patch:Patch;receipt:Receipt};
export const verifySchema=z.object({status:z.enum(['improved','partial','unclear']),summary:z.string().max(600),checks:z.array(z.object({label:z.string().max(160),met:z.boolean()})).max(5),nextStep:z.string().max(400)});
export type Verification=z.infer<typeof verifySchema>;
export const inputSchema=z.object({image:z.string().max(7_000_000).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),context:z.string().max(1200).default(''),budget:z.enum(['reuse','budget','upgrade']),language:z.enum(['en','es']).default('en')});
export function responseText(data:any):string {
 if(typeof data.choices?.[0]?.message?.content==='string')return data.choices[0].message.content;
 if(typeof data.output_text==='string')return data.output_text;
 return (data.output??[]).filter((o:any)=>o.type==='message').flatMap((o:any)=>o.content??[]).filter((c:any)=>c.type==='output_text').map((c:any)=>c.text).join('\n');
}
export function parseJSON(text:string){return JSON.parse(text.trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''));}

// Explicit provider-side JSON schemas; local Zod validation remains the final gate.
const str=(maxLength:number,minLength=0)=>({type:'string',minLength,maxLength});
const obj=(properties:Record<string,unknown>)=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const arr=(items:unknown,minItems:number,maxItems:number)=>({type:'array',items,minItems,maxItems});
export const patchJSONSchema=obj({
 title:str(100,3),summary:str(500),observations:arr(str(240),1,12),uncertainty:str(400),
 minutes:{type:'integer',minimum:1,maximum:480},costEstimate:str(120),materials:arr(str(120),0,8),
 steps:arr(obj({title:str(100),instruction:str(400),point:obj({x:{type:'number',minimum:0,maximum:100},y:{type:'number',minimum:0,maximum:100}})}),1,5),
 successCheck:str(400),safety:str(400),imagePrompt:str(1800),safeToDIY:{type:'boolean'}
});
export const verifyJSONSchema=obj({status:{type:'string',enum:['improved','partial','unclear']},summary:str(600),checks:arr(obj({label:str(160),met:{type:'boolean'}}),0,5),nextStep:str(400)});
