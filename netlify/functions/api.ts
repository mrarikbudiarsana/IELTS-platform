import '../../server/netlifyEnvironment';
import serverless from 'serverless-http';
import app from '../../server/app';
import { initDatabase } from '../../server/db';

let ready: Promise<void> | undefined;
const serve = serverless(app, { basePath: '/.netlify/functions/api' });
export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await (ready ||= initDatabase().catch(error => { ready = undefined; throw error; }));
    return await serve(event, context);
  } catch (error: any) {
    console.error('API initialization failed:', error.code || error.name);
    return { statusCode: 503, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({error:'Database unavailable. Please try again shortly.'}) };
  }
};
