import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Logging in student...');
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'teacher@ieltsplatform.test',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('Fetching test list to get reading test ID...');
  const testsRes = await fetch('http://localhost:4000/api/reading/tests', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const testsData = await testsRes.json();
  const readingTest = testsData.tests?.[0];
  console.log('Using reading test:', readingTest?.id, readingTest?.title);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2 });

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });

  await page.evaluate((jwt) => {
    localStorage.setItem('ielts_auth_token', jwt);
  }, token);

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // Navigate to Reading Catalogue
  console.log('Navigating to Reading Catalogue...');
  const readingBtn = await page.$('nav button ::-p-text(Reading)');
  if (readingBtn) {
    await readingBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
  }

  // Click "Start Practice" or "Resume Attempt" or "Take Mock Exam"
  console.log('Starting Reading Test Runner...');
  const startBtn = await page.$('button ::-p-text(Start Practice)') ||
                   await page.$('button ::-p-text(Take Mock Exam)') ||
                   await page.$('button ::-p-text(Resume Attempt)');
  if (startBtn) {
    await startBtn.click();
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 1. Capture Part 1
  console.log('Capturing Test Runner Part 1...');
  await page.screenshot({ path: path.join(screenshotsDir, 'reading_runner_part1.png'), fullPage: false });

  // 2. Click Part 2
  console.log('Switching to Part 2...');
  const part2Btn = await page.$('footer button ::-p-text(Part 2)');
  if (part2Btn) {
    await part2Btn.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Test Runner Part 2...');
    await page.screenshot({ path: path.join(screenshotsDir, 'reading_runner_part2.png'), fullPage: false });
  }

  // 3. Click Part 3
  console.log('Switching to Part 3...');
  const part3Btn = await page.$('footer button ::-p-text(Part 3)');
  if (part3Btn) {
    await part3Btn.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Test Runner Part 3...');
    await page.screenshot({ path: path.join(screenshotsDir, 'reading_runner_part3.png'), fullPage: false });
  }

  await browser.close();
  console.log('Reading test runner screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
