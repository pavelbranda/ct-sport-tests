import { test, expect } from '@playwright/test';

/**
 * Test 2 — Mobile menu navigation check (ČT Sport)
 *
 * Test Scenario:
 * • Open the ČT Sport main page with a viewport smaller than 700px
 * • Verify that the hamburger menu icon is visible
 * • Open the menu and click on "Cyklistika"
 * • Verify that you are on the "Cyklistika" section (by URL or header)
 *
 */
test('check cyklistika menu navigation (mobile)', async ({ page }) => {
  const viewportWidth = 600;
  const viewportHeight = 800;

  // Step 1: Set mobile viewport
  await page.setViewportSize({ width: viewportWidth, height: viewportHeight });

  // Step 2: Go to main page
  await page.goto('https://sport.ceskatelevize.cz/');
  console.log(`Opened ČT Sport main page in mobile viewport (${viewportWidth}x${viewportHeight}).`);

  // Step 3: Open hamburger menu ("Rubriky")
  const hamburger = page.locator('button[data-ctcomp-part="sections-toggle-button"]');
  await expect(hamburger).toBeVisible();
  console.log('-> Hamburger menu button is visible.');

  await hamburger.click();

  // Step 4: Click "Všechny sporty"
  const allSportsLink = page.getByRole('link', { name: 'Všechny sporty', exact: true });
  await expect(allSportsLink).toBeVisible();
  
  await allSportsLink.click();
  
  // Step 5: Find and click "Cyklistika"
  const cyclingLink = page.getByRole('link', { name: 'Cyklistika', exact: true });
  await expect(cyclingLink).toBeVisible();
  console.log('-> "Cyklistika" link is visible in the menu.');

  await cyclingLink.click();

  // Step 6: Verify correct section opened (URL contains /cyklistika)
  await expect(page).toHaveURL(/.*cyklistika.*/);
  console.log('-> Successfully navigated to the Cyklistika section.');
});