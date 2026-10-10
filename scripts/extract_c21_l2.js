const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
  const buf = fs.readFileSync('Cambridge IELTS 21 Listening Test 2.pdf');
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  fs.writeFileSync('extracted_c21_listening_test2.txt', res.text, 'utf8');
  console.log('Extracted characters:', res.text.length);
}

extract().catch(console.error);
