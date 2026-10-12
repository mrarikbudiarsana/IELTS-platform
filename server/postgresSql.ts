// Values remain bound parameters; quoted literals and comments are not placeholders.
export function toPostgresSql(input: string): string {
  // These are the only double-quoted string constants used by our legacy SQL.
  input = input.replace(/"(now|archived)"/g, "'$1'");
  let sql = input.replace(/datetime\('now'\)/gi, `to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`);
  sql = sql.replace(/datetime\('now',\s*'([+-]?\d+\s+(?:days?|hours?|minutes?|seconds?))'\)/gi,
    (_, interval) => `to_char((clock_timestamp() + interval '${interval}') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`);
  const ignore = /\bINSERT OR IGNORE\b/i.test(sql);
  sql = sql.replace(/\bINSERT OR IGNORE\b/gi, 'INSERT');
  if (ignore) sql = sql.trim().replace(/;$/, '') + ' ON CONFLICT DO NOTHING';
  let result = '', index = 0, quote = '', lineComment = false, blockComment = false;
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i], next = sql[i + 1];
    if (lineComment) { result += char; if (char === '\n') lineComment = false; continue; }
    if (blockComment) { result += char; if (char === '*' && next === '/') { result += next; i++; blockComment = false; } continue; }
    if (quote) {
      result += char;
      if (char === quote) { if (next === quote) { result += next; i++; } else quote = ''; }
      continue;
    }
    if (char === "'" || char === '"') { quote = char; result += char; }
    else if (char === '-' && next === '-') { lineComment = true; result += char + next; i++; }
    else if (char === '/' && next === '*') { blockComment = true; result += char + next; i++; }
    else result += char === '?' ? `$${++index}` : char;
  }
  return result;
}
