const fs = require('fs');
const files = fs.readdirSync('server').filter(f => f.endsWith('.ts'));
files.forEach(f => {
  const content = fs.readFileSync('server/' + f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('SELECT') && (line.includes('"archived"') || line.includes('"published"') || line.includes('"draft"'))) {
      console.log(`${f}:${i+1}: ${line.trim()}`);
    }
  });
});
