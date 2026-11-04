import {z} from 'zod';
import {inputSchema,patchSchema} from '../../../lib/patch';
import {meta,config,guard,errorResponse,readBody,ApiError} from '../../../lib/meta';
export async function POST(request:Request){try{
 guard(request);const b=z.object({image:inputSchema.shape.image,patch:patchSchema}).safeParse(await readBody(request));if(!b.success)throw new ApiError('A valid patch and photo are required.',400);
 if(!b.data.patch.safeToDIY)throw new ApiError('Visualization is disabled for a patch requiring professional help.',400);
 const {data,receipt}=await meta({model:config().image,input:[{role:'user',content:[{type:'input_text',text:`Edit the provided photo as a realistic concept visualization of a small organization improvement. Preserve viewpoint, geometry, objects and lighting. No text, overlays, split screen, watermarks or invented expensive furniture. This is a proposal, not proof of completion. Apply only these reversible changes: ${JSON.stringify(b.data.patch.steps)}. Extra scene guidance: ${b.data.patch.imagePrompt}`},{type:'input_image',image_url:b.data.image}]}],tools:[{type:'image_generation',enable_web_search:false,enable_image_search:false,enable_shell:false,reasoning_strength:'low',output_format:'webp'}]},150_000);
 const item=data.output?.find((o:any)=>o.type==='image_generation_call'&&typeof o.result==='string');
 if(!item)throw new ApiError('Muse Image returned no image. Your annotated action plan is still available.',502);
 return Response.json({image:`data:image/webp;base64,${item.result}`,receipt});
 }catch(e){return errorResponse(e);}}
