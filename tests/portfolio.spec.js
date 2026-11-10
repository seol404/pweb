import { expect, test } from '@playwright/test';

const inputFor = (page) => page.getByRole('textbox', { name: 'Terminal command' });
const outputFor = (page) => page.getByRole('log', { name: 'Terminal output' });

async function command(page, text) {
  const input = inputFor(page);
  await input.fill(text);
  await input.press('Enter');
  await expect(input).toHaveValue('');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(inputFor(page)).toBeVisible();
});

test('welcome renders without browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Christina Lee', exact: true })).toBeVisible();
  await expect(outputFor(page)).toContainText('Christina');
  await expect(page).toHaveTitle(/Christina Lee/);
  expect(errors).toEqual([]);
});

test('portfolio sections can be explored from the prompt', async ({ page }) => {
  await command(page, 'ls /christina');
  await expect(outputFor(page).getByRole('heading', { name: 'About Christina' })).toBeVisible();
  await expect(outputFor(page)).toContainText('UT Austin');

  await command(page, 'ls /experience');
  for (const company of ['Cloudflare', 'Bloomberg', 'CrowdStrike']) {
    await expect(outputFor(page)).toContainText(company);
  }
  await expect(outputFor(page)).toContainText('10,000+');
});

test('relative paths use the changed working directory', async ({ page }) => {
  await command(page, 'clear');
  await command(page, 'cd /projects');
  await command(page, 'pwd');
  await expect(outputFor(page)).toContainText('/projects');
  await command(page, 'ls');
  await expect(outputFor(page)).toContainText('PintOS');
  await command(page, 'cat ../education/README.md');
  await expect(outputFor(page)).toContainText('Bachelor of Science in Computer Science');
  await command(page, 'cd ..');
  await command(page, 'ls');
  await expect(outputFor(page)).toContainText('resume.pdf');
});

test('history, tab completion, and clear keep the prompt usable', async ({ page }) => {
  const input = inputFor(page);
  await command(page, 'echo history-marker');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('echo history-marker');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('');
  await input.fill('ls /exp');
  await input.press('Tab');
  await expect(input).toHaveValue(/^ls \/experience\s*$/);
  await input.press('Enter');
  await expect(outputFor(page)).toContainText('Cloudflare');
  await command(page, 'clear');
  await expect(outputFor(page)).not.toContainText('history-marker');
  await expect(outputFor(page)).not.toContainText('Cloudflare');
  await command(page, 'echo still-here');
  await expect(outputFor(page)).toContainText('still-here');
  await input.press('Control+l');
  await expect(outputFor(page)).not.toContainText('still-here');
});

test('unknown commands and invalid paths recover gracefully', async ({ page }) => {
  await command(page, 'not-a-command');
  await expect(outputFor(page)).toContainText('command not found');
  await command(page, 'ls /missing');
  await expect(outputFor(page)).toContainText('No such file or directory');
  await command(page, 'help');
  await expect(outputFor(page)).toContainText('cd [path]');
  await command(page, 'ls /projects');
  await expect(outputFor(page)).toContainText('PintOS');
});

test('ambiguous completions can be chosen and dismissed with the keyboard', async ({ page }) => {
  const input = inputFor(page);
  const suggestions = page.getByRole('group', { name: 'Command suggestions' });
  await input.fill('ls /');
  await input.press('Tab');
  await expect(suggestions).toBeVisible();
  const choices = suggestions.getByRole('button');
  await expect(choices.first()).toBeFocused();
  await choices.first().press('Tab');
  await expect(choices.nth(1)).toBeFocused();
  await expect(choices.nth(1)).toHaveText('ls /experience');
  await choices.nth(1).press('Enter');
  await expect(suggestions).not.toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('ls /experience');
  await input.press('Enter');
  await expect(outputFor(page)).toContainText('Cloudflare');

  await input.fill('ls /');
  await input.press('Tab');
  await expect(suggestions).toBeVisible();
  await choices.first().press('Escape');
  await expect(suggestions).not.toBeVisible();
  await expect(input).toBeFocused();

  await input.fill('ls /experience');
  await input.press('Tab');
  await expect(input).not.toBeFocused();
  await expect(suggestions).not.toBeVisible();
});

test('theme selection persists across reloads', async ({ page }) => {
  await command(page, 'theme light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await command(page, 'theme dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('contact links and downloadable resume point to the supplied profile', async ({ page, request }) => {
  await command(page, 'ls /contact');
  const output = outputFor(page);
  await expect(output.locator('a[href="mailto:seohyeon7426@gmail.com"]')).toBeVisible();
  await expect(output.locator('a[href="https://github.com/seol404"]')).toBeVisible();
  await expect(output.locator('a[href="https://www.linkedin.com/in/christinaseohyeonlee/"]')).toBeVisible();
  await command(page, 'open resume');
  await expect(output.locator('a[href$="resume.pdf"]').last()).toBeVisible();
  const resume = await request.get('/resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('sidebar navigation works without typing', async ({ page }) => {
  await page.getByRole('button', { name: 'Open /experience', exact: true }).click();
  await expect(outputFor(page)).toContainText('CrowdStrike');
  await page.getByRole('button', { name: 'Open /skills', exact: true }).click();
  await expect(outputFor(page)).toContainText('Python');
});

test('mobile navigation and terminal stay within the viewport @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const experience = page.getByRole('button', { name: 'Open /experience', exact: true });
  if (!(await experience.isVisible())) {
    await page.getByRole('button', { name: 'Toggle file explorer', exact: true }).click();
  }
  await experience.click();
  await expect(outputFor(page)).toContainText('Cloudflare');
  await command(page, 'ls /projects');
  await expect(outputFor(page)).toContainText('PintOS');
  await command(page, 'echo <script>alert(1)</script>');
  await expect(outputFor(page)).toContainText('<script>alert(1)</script>');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await expect(inputFor(page)).toBeInViewport();
});

test('keyboard users can tab out of an empty prompt @mobile', async ({ page }) => {
  const input = inputFor(page);
  await input.focus();
  await input.press('Tab');
  await expect(input).not.toBeFocused();
});

test('narrow mobile screens retain readable output and a usable prompt @mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const text of ['ls /experience', 'ls /projects', 'help']) {
    await command(page, text);
    await expect(inputFor(page)).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await outputFor(page).evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
  const inputBox = await inputFor(page).boundingBox();
  expect(inputBox.width).toBeGreaterThan(50);
});

test('capture key layouts for visual review @visual', async ({ page }, testInfo) => {
  const capture = async (name) => {
    const path = testInfo.outputPath('artifacts', `${name}.png`);
    await page.screenshot({ path, animations: 'disabled' });
    await testInfo.attach(name, { path, contentType: 'image/png' });
    console.log(`Visual review: ${path}`);
  };

  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole('heading', { name: 'Christina Lee', exact: true })).toBeVisible();
  await capture('home-desktop');

  await page.setViewportSize({ width: 1440, height: 800 });
  await expect(inputFor(page)).toBeInViewport();
  await capture('home-desktop-short');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(inputFor(page)).toBeInViewport();
  await capture('home-mobile');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Open /experience', exact: true }).click();
  await expect(outputFor(page).getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await capture('experience-desktop');

  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await capture('home-light');
});
