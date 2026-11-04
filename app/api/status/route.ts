import {config} from '../../../lib/meta';
export async function GET(){const c=config();return Response.json({configured:Boolean(c.key),spark:c.spark,image:c.image},{headers:{'Cache-Control':'no-store'}});}
