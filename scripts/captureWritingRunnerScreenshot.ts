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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to app...');
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

  // Navigate to Writing
  console.log('Navigating to Writing tab...');
  const writingTab = await page.$('button ::-p-text(Writing)');
  if (writingTab) {
    await writingTab.click();
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Click Open Writing Workspace
  console.log('Finding Open Writing Workspace button...');
  const workspaceBtn = await page.waitForSelector('button ::-p-text(Open Writing Workspace)');
  if (workspaceBtn) {
    console.log('Clicking Open Writing Workspace...');
    await workspaceBtn.click();
  }

  // Wait for the textarea to be rendered
  console.log('Waiting for writing workspace textarea...');
  await page.waitForSelector('textarea', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1000));

  console.log('Capturing Writing Workspace Task 1...');
  await page.screenshot({ path: path.join(screenshotsDir, 'writing_runner_task1.png') });

  // Switch to Task 2 if footer button exists
  const task2Btn = await page.$('footer button ::-p-text(Task 2)');
  if (task2Btn) {
    console.log('Switching to Task 2...');
    await task2Btn.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing Writing Workspace Task 2...');
    await page.screenshot({ path: path.join(screenshotsDir, 'writing_runner_task2.png') });
  }

  await browser.close();
  console.log('Done capturing writing screenshots!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
