import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching Edge via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Open app
  console.log('Navigating to http://localhost:4000...');
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });

  // 2. Log in as Demo Student via Reviewer Switcher or direct login
  console.log('Setting up student session...');
  try {
    // Check if Sign In button exists
    const signInBtn = await page.$('button ::-p-text(Sign In)');
    if (signInBtn) {
      // Click Reviewer Switcher
      const switcherBtn = await page.$('button[title*="Reviewer"]');
      if (switcherBtn) {
        await switcherBtn.click();
        await new Promise((r) => setTimeout(r, 400));
        const demoStudentBtn = await page.$('button ::-p-text(Demo Student)');
        if (demoStudentBtn) {
          await demoStudentBtn.click();
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }
  } catch (err) {
    console.log('Session setup note:', err);
  }

  // 3. CAPTURE DESKTOP DASHBOARD (1280x800)
  console.log('Capturing Desktop Dashboard (1280x800)...');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, 'dashboard_desktop.png'), fullPage: false });

  // 4. NAVIGATE TO DESKTOP READING PRACTICE / CATALOGUE
  console.log('Navigating to Desktop Reading Catalogue...');
  const practiceNavBtn = await page.$('nav button ::-p-text(Practice)');
  if (practiceNavBtn) {
    await practiceNavBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
  }
  console.log('Capturing Desktop Reading Catalogue (1280x800)...');
  await page.screenshot({ path: path.join(screenshotsDir, 'reading_catalogue_desktop.png'), fullPage: false });

  // 4b. START CAMBRIDGE IELTS 21 AND CAPTURE OFFICIAL TEST RUNNER
  console.log('Launching Cambridge IELTS 21 Test Runner...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[class*="rounded-xl"]'));
    const cambridgeCard = cards.find((c) => c.textContent && c.textContent.includes('Cambridge IELTS 21'));
    if (cambridgeCard) {
      const btn = cambridgeCard.querySelector('button');
      if (btn) btn.click();
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  console.log('Capturing Official Reading Exam Workspace (1280x800)...');
  await page.screenshot({ path: path.join(screenshotsDir, 'reading_exam_official_desktop.png'), fullPage: false });

    // Click Question 8 to see Flow-Chart Completion with inline gaps
    const q8Btn = await page.$('footer button ::-p-text(8)');
    if (q8Btn) {
      await q8Btn.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(screenshotsDir, 'reading_exam_official_desktop_q8.png'), fullPage: false });
    }

    // Click Questions 11 to see Summary Completion with gaps matching user's reference
    const q11Btn = await page.$('footer button ::-p-text(11)');
    if (q11Btn) {
      await q11Btn.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(screenshotsDir, 'reading_exam_official_desktop_q11.png'), fullPage: false });
    }

    // Click Passage 2 tab to view Passage 2 and Drag & Drop / Dropdown Summary Completion (Q14-19)
    console.log('Navigating to Passage 2 in footer...');
    const p2Btn = await page.$('footer button ::-p-text(Passage 2)');
    if (p2Btn) {
      await p2Btn.click();
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(screenshotsDir, 'reading_exam_official_desktop_q14.png'), fullPage: false });

      // Select option 'I' (dense population) via the dropdown slot in Question 14 to test interactive selection
      const select14 = await page.$('select#question-input-14');
      if (select14) {
        await select14.select('I');
        await new Promise((r) => setTimeout(r, 1000));
        await page.screenshot({ path: path.join(screenshotsDir, 'reading_exam_official_desktop_q14_selected.png'), fullPage: false });
      }
    }

    // Exit test back to catalogue
    const exitBtn = await page.$('header button[title*="Exit"]');
    if (exitBtn) {
      await exitBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      const confirmExit = await page.$('button ::-p-text(Exit Workspace)');
      if (confirmExit) {
        await confirmExit.click();
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // 4c. SWITCH TO LISTENING AND CAPTURE OFFICIAL LISTENING TEST RUNNER
    console.log('Navigating to Listening Tab in Catalogue...');
    const listeningTabBtn = await page.$('button ::-p-text(Listening)');
    if (listeningTabBtn) {
      await listeningTabBtn.click();
      await new Promise((r) => setTimeout(r, 1200));

      console.log('Launching first Listening Test...');
      const startListeningBtn = await page.$('button ::-p-text(Start Practice)');
      if (startListeningBtn) {
        await startListeningBtn.click();
      } else {
        const resumeBtn = await page.$('button ::-p-text(Resume Attempt)');
        if (resumeBtn) await resumeBtn.click();
      }
      await new Promise((r) => setTimeout(r, 1500));

      // Handle AudioCheckModal if present
      const beginBtn = await page.$('button ::-p-text(Begin Test)');
      if (beginBtn) {
        await beginBtn.click();
        await new Promise((r) => setTimeout(r, 1500));
      }

      console.log('Capturing Official Listening Exam Workspace (1280x800)...');
      await page.screenshot({ path: path.join(screenshotsDir, 'listening_exam_official_desktop.png'), fullPage: false });

      // Exit test back to catalogue
      const exitListBtn = await page.$('header button[title*="Exit"]');
      if (exitListBtn) {
        await exitListBtn.click();
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // 4d. SWITCH TO WRITING AND CAPTURE OFFICIAL WRITING TEST WORKSPACE
    console.log('Navigating to Writing Tab in Catalogue...');
    const writingTabBtn = await page.$('button ::-p-text(Writing)');
    if (writingTabBtn) {
      await writingTabBtn.click();
      await new Promise((r) => setTimeout(r, 1200));

      console.log('Launching first Writing Task...');
      const openWritingBtn = await page.$('button ::-p-text(Open Writing Workspace)');
      if (openWritingBtn) {
        await openWritingBtn.click();
        await new Promise((r) => setTimeout(r, 2000));
      }

      console.log('Capturing Official Writing Exam Workspace (1280x800)...');
      await page.screenshot({ path: path.join(screenshotsDir, 'writing_exam_official_desktop.png'), fullPage: false });

      // Exit test back to catalogue
      const exitWritBtn = await page.$('header button[title*="Exit"]');
      if (exitWritBtn) {
        await exitWritBtn.click();
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

  // 5. SWITCH TO MOBILE VIEWPORT (390x844) & GO TO DASHBOARD
  console.log('Setting mobile viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  // Click Brand Logo to go back to Dashboard
  const brandLogo = await page.$('header div[class*="cursor-pointer"]');
  if (brandLogo) {
    await brandLogo.click();
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('Capturing Mobile Dashboard (390x844)...');
  await page.screenshot({ path: path.join(screenshotsDir, 'dashboard_mobile.png'), fullPage: false });

  // 6. ON MOBILE DASHBOARD, OPEN MENU AND CLICK 'Practice'
  console.log('Navigating to Mobile Reading Catalogue via Mobile Drawer...');
  const toggleBtn = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (toggleBtn) {
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const mobilePractice = await page.$('div[class*="md:hidden"] button ::-p-text(Practice)');
    if (mobilePractice) {
      await mobilePractice.click();
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  console.log('Capturing Mobile Reading Catalogue (390x844)...');
  await page.screenshot({ path: path.join(screenshotsDir, 'reading_catalogue_mobile.png'), fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully in screenshots/ directory!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
