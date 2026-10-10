const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle0' });

  // Sign in via localStorage token directly for speed and reliability
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@ieltsplatform.test', password: 'Password123!' })
  });
  const loginData = await loginRes.json();

  await page.evaluate((data) => {
    localStorage.setItem('ielts_auth_token', data.token);
    localStorage.setItem('ielts_user', JSON.stringify(data.user));
    window.location.reload();
  }, loginData);

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Reading
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const readingBtn = btns.find(b => b.textContent && b.textContent.includes('Reading'));
    if (readingBtn) readingBtn.click();
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'screenshots/reading_cards_logged_in.png' });
  await browser.close();
  console.log('Saved to screenshots/reading_cards_logged_in.png');
})();
