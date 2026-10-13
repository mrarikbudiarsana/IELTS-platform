import '../../server/netlifyEnvironment';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../server/auth';
import { processImportJob } from '../../server/importJobService';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  let jobId: string;
  try {
    const header = event.headers?.authorization || event.headers?.Authorization || '';
    const claims = jwt.verify(header.replace(/^Bearer /, ''), JWT_SECRET, { algorithms: ['HS256'], audience: 'import-worker' }) as jwt.JwtPayload;
    jobId = JSON.parse(event.body || '{}').jobId;
    if (!jobId || claims.jobId !== jobId) return { statusCode: 403 };
  } catch { return { statusCode: 401 }; }
  await processImportJob(jobId);
  return { statusCode: 200 };
};
