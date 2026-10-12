import assert from 'node:assert/strict';
import { X509Certificate } from 'node:crypto';
import { postgresConnectionOptions } from '../server/postgresTls';
import { supabaseRootCertificate } from '../server/supabaseRootCertificate';

const certificate = new X509Certificate(supabaseRootCertificate);
assert.equal(certificate.ca, true);
assert.equal(certificate.verify(certificate.publicKey), true);
const options = postgresConnectionOptions('postgresql://test:password@aws-0-test.pooler.supabase.com:6543/postgres?sslmode=require');
assert.equal(options.ssl.rejectUnauthorized, true);
assert.deepEqual(options.ssl.ca, [supabaseRootCertificate]);
assert.equal(new URL(options.connectionString).searchParams.has('sslmode'), false);
const escaped = postgresConnectionOptions('postgresql://test:password@db.example.com/test',supabaseRootCertificate.replace(/\r?\n/g,'\\n'));
assert.equal(new X509Certificate(escaped.ssl.ca![0]).fingerprint256,certificate.fingerprint256);
assert.equal(postgresConnectionOptions('postgresql://test:password@db.example.com/test').ssl.ca, undefined);
assert.throws(() => postgresConnectionOptions('postgresql://test:password@db.example.com/test','not a certificate'),/PEM certificate/);
console.log('PostgreSQL TLS checks passed: trusted root, escaped PEM, SSL verification, URL overrides, and host scoping.');
