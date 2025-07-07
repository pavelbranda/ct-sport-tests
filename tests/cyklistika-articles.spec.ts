import { test, expect } from '@playwright/test';

test('check cyklistika articles', async ({ page }) => {
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
  const dateCount = await articleDates.count();
  console.log(`Found ${dateCount} articles with dates.`);

  // Step 7: Check each date is visible
  for (let i = 0; i < dateCount; i++) {
    const dateLocator = articleDates.nth(i);
    
    // Optional: Debug log for development
    // const dateText = await dateLocator.innerText();
    // console.log(`Article ${i + 1}: ${dateText}`);

    // Check visibility
    await expect(dateLocator).toBeVisible();
  }

  // Step 8: Find all clickable articles on the whole page
  const articles = page.locator('a.article-link, a[data-ctcomp-part="opener-content"]');

  // Step 9: Count and log all article titles (optional debug)
  const articleCount = await articles.count();
  console.log(`Found ${articleCount} articles on the page.`);

  // Debug: print short titles or positions
  for (let i = 0; i < articleCount; i++) {
    const title = await articles.nth(i).locator('h2').innerText().catch(() => '[no title]');
    console.log(`Article ${i + 1}: ${title}`);
  } 

  // Step 10: Find first non-video article
  let nonVideoArticleFound = false;

  for (let i = 0; i < articleCount; i++) {
    const article = articles.nth(i);
    const title = await article.locator('h2').innerText().catch(() => '[no title]');

    // Check for span with class "icon--video"
    const videoBadge = article.locator('span.icon--video');
    const hasVideo = await videoBadge.count() > 0;

    if (!hasVideo) {
      console.log(`Found first non-video article: "${title}" (index ${i + 1})`);

      // Optional: highlight
      await article.evaluate(el => el.style.outline = '3px solid green');
      await page.pause();

      // Step 11: Click the first non-video article
      await article.click();
      await page.pause();

      // Step 12: Wait for new page to load
      await page.waitForLoadState('domcontentloaded');

      // Step 13: Verify Autor and Zdroj

      // Autor
      const authorHeading = page.getByRole('heading', { name: 'Autor' });
      await expect(authorHeading).toBeVisible();

      const authorName = authorHeading.locator('xpath=following-sibling::span[1]');
      await expect(authorName).toBeVisible();

      const authorText = await authorName.innerText();
      console.log(`Author found: ${authorText}`);

      // Zdroj
      const sourceHeading = page.getByRole('heading', { name: 'Zdroj' });
      await expect(sourceHeading).toBeVisible();

      const sourceName = sourceHeading.locator('xpath=following-sibling::span[1]');
      await expect(sourceName).toBeVisible();

      const sourceText = await sourceName.innerText();
      console.log(`Source found: ${sourceText}`);

      await page.pause();

      nonVideoArticleFound = true;
      break;
    } else {
      console.log(`Skipping video article: "${title}"`);
    }
  }

  if (!nonVideoArticleFound) {
    console.log('No non-video article found!');
  }
});
