import { env } from 'cloudflare:workers';
export class ApiError extends Error { constructor(message:string,public status=500){super(message);} }
export function config(){const e=env as unknown as Record<string,string|undefined>;return {key:e.MODEL_API_KEY||process.env.MODEL_API_KEY,spark:e.META_SPARK_MODEL||process.env.META_SPARK_MODEL||'muse-spark-1.3',image:e.META_IMAGE_MODEL||process.env.META_IMAGE_MODEL||'muse-image-1.0'};}
export async function meta(body:Record<string,unknown>,timeout=90_000){
 const key=config().key;if(!key)throw new ApiError('Meta is not connected yet. Add MODEL_API_KEY to the server environment.',503);
 const start=Date.now();
 let res:Response;
 try {res=await fetch('https://api.meta.ai/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({...body,store:false}),signal:AbortSignal.timeout(timeout)});}
 catch {throw new ApiError('Meta did not respond in time. Your photo is still here; try again.',504);}
 if(!res.ok){const id=res.headers.get('x-request-id');await res.text();throw new ApiError(`Meta returned HTTP ${res.status}${id?` (request ${id.slice(0,80)})`:''}. ${res.status===401?'Check the server API key.':res.status===429?'Rate limit or credits may need attention. Retry shortly.':'Check model access and billing in your Meta dashboard.'}`,502);}
 const data=await res.json() as any;
 if(data.status==='failed'||data.status==='incomplete')throw new ApiError('Meta could not complete this request. Please retry.',502);
 return {data,receipt:{model:String(data.model||body.model),responseId:String(data.id||''),elapsedMs:Date.now()-start,createdAt:new Date().toISOString()}};
}
export function errorResponse(error:unknown){if(import.meta.env.DEV && !(error instanceof ApiError)){const e=error as {name?:string;issues?:unknown};console.warn('PATCH response validation failure',{name:e.name,issues:e.issues});}if(error instanceof ApiError)return Response.json({error:error.message},{status:error.status});return Response.json({error:'The model response could not be validated. Please try another clear photo or retry.'},{status:502});}
// Best-effort single-isolate burst protection, not a durable per-user quota.
const recent=new Map<string,number>();
export function guard(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new ApiError('Cross-origin requests are not allowed.',403);
 const key=request.headers.get('oai-authenticated-user-id')||request.headers.get('cf-connecting-ip')||'local';
 const now=Date.now();if(now-(recent.get(key)||0)<2000)throw new ApiError('Please wait a moment before starting another patch.',429);
 if(recent.size>1000)recent.clear();recent.set(key,now);
 if(Number(request.headers.get('content-length')||0)>8_000_000)throw new ApiError('Please use a smaller photo.',413);
}
export async function readBody(request:Request){const raw=await request.text();if(raw.length>8_000_000)throw new ApiError('Please use a smaller photo.',413);try{return JSON.parse(raw);}catch{throw new ApiError('Invalid request.',400);}}
