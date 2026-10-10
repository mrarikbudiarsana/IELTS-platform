import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 2 });

  await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });

  // Click Sign In button at bottom left
  console.log('Opening Sign In modal...');
  const signInBtn = await page.$('button ::-p-text(Sign In)');
  if (signInBtn) {
    await signInBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Click Demo Teacher
    console.log('Clicking Demo Teacher...');
    const demoTeacherBtn = await page.$('button ::-p-text(Demo Teacher)');
    if (demoTeacherBtn) {
      await demoTeacherBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  // Navigate to Listening
  console.log('Navigating to Listening tab...');
  const listeningTab = await page.$('button ::-p-text(Listening)');
  if (listeningTab) {
    await listeningTab.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Find the 40-question mock card: "Official IELTS Listening Full Mock Examination 1"
  console.log('Finding Official IELTS Listening Full Mock test card...');
  const cards = await page.$$('div.group');
  let clicked = false;
  for (const card of cards) {
    const text = await page.evaluate((el) => el.textContent, card);
    if (text && text.includes('Official IELTS Listening Full Mock')) {
      const btn = await card.$('button');
      if (btn) {
        console.log('Clicking full mock exam button...');
        await btn.click();
        clicked = true;
        await new Promise((r) => setTimeout(r, 2000));
        break;
      }
    }
  }

  if (!clicked) {
    console.log('Fallback: clicking first available mock or practice button...');
    const practiceBtn =
      (await page.$('button ::-p-text(Take Mock Exam)')) ||
      (await page.$('button ::-p-text(Start Practice)')) ||
      (await page.$('button ::-p-text(Resume Attempt)'));
    if (practiceBtn) {
      await practiceBtn.click();
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Audio check modal
  const beginBtn = await page.$('button ::-p-text(Begin Test)');
  if (beginBtn) {
    console.log('Clicking Begin Test in audio modal...');
    await beginBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  // 1. Capture Part 1
  console.log('Capturing Part 1...');
  await page.screenshot({ path: path.join(screenshotsDir, 'listening_runner_part1.png'), fullPage: false });

  // 2. Click Part 2 in footer
  console.log('Clicking Part 2...');
  const part2Btn = await page.$('footer button ::-p-text(Part 2)');
  if (part2Btn) {
    await part2Btn.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Capturing Part 2...');
    await page.screenshot({ path: path.join(screenshotsDir, 'listening_runner_part2.png'), fullPage: false });
  }

  // 3. Click Part 3 in footer
  console.log('Clicking Part 3...');
  const part3Btn = await page.$('footer button ::-p-text(Part 3)');
  if (part3Btn) {
    await part3Btn.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Capturing Part 3...');
    await page.screenshot({ path: path.join(screenshotsDir, 'listening_runner_part3.png'), fullPage: false });
  }

  // 4. Click Part 4 in footer
  console.log('Clicking Part 4...');
  const part4Btn = await page.$('footer button ::-p-text(Part 4)');
  if (part4Btn) {
    await part4Btn.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Capturing Part 4...');
    await page.screenshot({ path: path.join(screenshotsDir, 'listening_runner_part4.png'), fullPage: false });
  }

  await browser.close();
  console.log('Done capturing screenshots!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
