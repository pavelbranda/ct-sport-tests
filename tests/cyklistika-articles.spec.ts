import { test, expect } from '@playwright/test';

test('check cycling articles', async ({ page }) => {
  // Step 1: Go to main page
  await page.goto('https://sport.ceskatelevize.cz/');

  // Step 2: Click "Všechny sporty"
  await page.getByRole('button', { name: 'Všechny sporty' }).click();

  // Step 3: Click "Cyklistika"
  await page.getByRole('link', { name: 'Cyklistika',exact:true }).click();
  // await page.pause(); 

  // Step 4: Select container with main articles only
  const articleContainer = page.locator('div[data-load-more-container="article-link-list"]');

  // Step 5: Find <span> or <time> with data-ctcomp attribute inside container
  const articleDates = articleContainer.locator(':scope span[data-ctcomp="utils.DateFormatter"], :scope time[data-ctcomp="utils.DateFormatter"]');

  // Step 6: Count and log high-level info.
  const count = await articleDates.count();
  console.log(`Found ${count} articles with dates.`);

  // Step 7: Check each date is visible
  for (let i = 0; i < count; i++) {
    const dateLocator = articleDates.nth(i);
    
    // Optional: Debug log for development
    // const dateText = await dateLocator.innerText();
    // console.log(`Article ${i + 1}: ${dateText}`);

    // Check visibility
    await expect(dateLocator).toBeVisible();
  }
});
