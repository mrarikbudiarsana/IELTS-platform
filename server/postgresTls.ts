import { X509Certificate } from 'node:crypto';
import { supabaseRootCertificate } from './supabaseRootCertificate';

export function postgresConnectionOptions(connectionString: string, suppliedCa?: string) {
  const url = new URL(connectionString);
  const supabase = /\.supabase\.(com|co)$/i.test(url.hostname);
  const certificates = supabase ? [supabaseRootCertificate] : [];
  if (suppliedCa?.trim()) {
    const normalized = suppliedCa.trim().replace(/^(["'])([\s\S]*)\1$/, '$2').replace(/\\+n/g, '\n');
    try {
      new X509Certificate(normalized);
      if (!certificates.includes(normalized)) certificates.push(normalized);
    } catch {
      if (!supabase) throw new Error('DATABASE_SSL_CA must contain a PEM certificate.');
      console.warn('DATABASE_SSL_CA is malformed; using the bundled Supabase root certificate.');
    }
  }
  // pg connection-string SSL parameters otherwise replace the explicit CA config.
  for (const parameter of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert', 'uselibpqcompat']) url.searchParams.delete(parameter);
  return {
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true, ...(certificates.length ? { ca: certificates } : {}) },
  };
}
