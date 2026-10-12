import '../../server/netlifyEnvironment';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../server/auth';
import { processAssessmentJob } from '../../server/aiWritingService';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  let assessmentId: string;
  try {
    const header = event.headers.authorization || event.headers.Authorization || '';
    const claims = jwt.verify(header.replace(/^Bearer /, ''), JWT_SECRET, { algorithms: ['HS256'], audience: 'writing-worker' }) as jwt.JwtPayload;
    assessmentId = JSON.parse(event.body || '{}').assessmentId;
    if (!assessmentId || claims.assessmentId !== assessmentId) return {statusCode:403};
  } catch {
    return {statusCode:401};
  }
  try {
    await processAssessmentJob(assessmentId);
    return { statusCode: 200 };
  } catch (error: any) {
    console.error('Writing worker failed:', error.name);
    throw error;
  }
};
