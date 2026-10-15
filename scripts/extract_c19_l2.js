const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
  console.log('Extracting Test 2 questions PDF...');
  const buf1 = fs.readFileSync('Cambridge IELTS 19 Academic Listening Test 2.pdf');
  const parser1 = new PDFParse({ data: buf1 });
  const res1 = await parser1.getText();
  fs.writeFileSync('extracted_c19_listening_test2.txt', res1.text, 'utf8');
  console.log('Extracted test questions characters:', res1.text.length);

  console.log('Extracting Test 2 audio scripts PDF...');
  const buf2 = fs.readFileSync('Cambridge IELTS 19 Academic Listening Test 2 Script.pdf');
  const parser2 = new PDFParse({ data: buf2 });
  const res2 = await parser2.getText();
  fs.writeFileSync('extracted_c19_listening_test2_audio_scripts.txt', res2.text, 'utf8');
  console.log('Extracted audio scripts characters:', res2.text.length);
}

extract().catch(console.error);
