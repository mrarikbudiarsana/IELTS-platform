import assert from 'node:assert/strict';
import { startPostgres } from './postgresHarness';

async function main() {
  const pg = await startPostgres();
  try {
    process.env.JWT_SECRET = 'netlify-integration-test-secret-only';
    process.env.TEACHER_SETUP_SECRET = 'netlify-integration-teacher-secret-only';
    const { handler } = await import('../netlify/functions/api');
    const request = async (path: string, method = 'GET', payload?: any, token?: string) => {
      const response = await handler({
        httpMethod: method, path, headers: { 'content-type':'application/json', ...(token ? {authorization:`Bearer ${token}`} : {}) },
        body: payload ? JSON.stringify(payload) : null, isBase64Encoded:false,
        queryStringParameters:null, multiValueQueryStringParameters:null,
        requestContext:{identity:{sourceIp:'127.0.0.1'}, requestId:'netlify-test'},
      }, {}) as any;
      return {status:response.statusCode,body:JSON.parse(response.body)};
    };
    for (const path of ['/api/health','/.netlify/functions/api/api/health']) {
      const health = await request(path);
      assert.equal(health.status,200);
      assert.equal(health.body.status,'ok');
    }
    const registered = await request('/.netlify/functions/api/api/auth/register','POST',{email:'netlify@test.invalid',password:'NetlifyTestOnly123!',fullName:'Netlify Test',testTypePreference:'academic'});
    assert.equal(registered.status,201);
    assert.equal(registered.body.user.role,'student');
    assert.ok(registered.body.token);
    const login = await request('/api/auth/login','POST',{email:'netlify@test.invalid',password:'NetlifyTestOnly123!'});
    assert.equal(login.status,200);
    const me = await request('/api/auth/me','GET',undefined,login.body.token);
    assert.equal(me.status,200);
    assert.equal(me.body.user.email,'netlify@test.invalid');
    assert.equal((await request('/api/auth/me')).status,401);
    assert.equal((await request('/api/not-a-route')).status,404);
    const worker = await import('../netlify/functions/grade-writing-background');
    assert.equal((await worker.handler({httpMethod:'GET'})).statusCode,405);
    assert.equal((await worker.handler({httpMethod:'POST',headers:{},body:'{}'})).statusCode,401);
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({assessmentId:'missing-test-job'},process.env.JWT_SECRET,{algorithm:'HS256',audience:'writing-worker',expiresIn:'10m'});
    assert.equal((await worker.handler({httpMethod:'POST',headers:{authorization:`Bearer ${token}`},body:JSON.stringify({assessmentId:'different-job'})})).statusCode,403);
    assert.equal((await worker.handler({httpMethod:'POST',headers:{authorization:`Bearer ${token}`},body:JSON.stringify({assessmentId:'missing-test-job'})})).statusCode,200);
    assert.equal((await pg.query('SELECT count(*)::integer AS count FROM users')).rows[0]['count'],1);
    console.log('Netlify integration passed: forwarded and direct API paths, registration, login, authenticated session, 401/404 JSON, and no cold-start seeds.');
  } finally { await pg.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
