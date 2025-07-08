import { test, expect } from '@playwright/test';

/**
 * Test 1 — Cyklistika articles page check (ČT Sport)
 *
 * Test Scenario:
 * • Open the ČT Sport main page
 * • Navigate to the "Cyklistika" section through the "Všechny sporty" menu
 * • Verify that all articles have a visible date
 * • Find and open the first article without a video badge
 * • Check that the article has an "Author" and "Source" section
 * • Check that the "Related articles" section exists and that the first related article belongs to "Cyklistika"
 * 
 */
test('check cyklistika articles', async ({ page }) => {
  // Step 1: Go to main page
  await page.goto('https://sport.ceskatelevize.cz/');

  // Step 2: Click and open "Všechny sporty" menu
  await page.getByRole('button', { name: 'Všechny sporty' }).click();

  // Step 3: Click on "Cyklistika" section
  await page.getByRole('link', { name: 'Cyklistika', exact: true }).click();
  // await page.pause();

  // Step 4: Select container with main articles only
  const articleContainer = page.locator('div[data-load-more-container="article-link-list"]');

  // Step 5: Find all date elements inside the container (<span> or <time> with data-ctcomp)
  const articleDates = articleContainer.locator(':scope span[data-ctcomp="utils.DateFormatter"], :scope time[data-ctcomp="utils.DateFormatter"]');

  // Step 6: Count and log dates
  const dateCount = await articleDates.count();
  console.log(`Found ${dateCount} articles with dates.`);

  // Step 7: Verify each date element is visible
  for (let i = 0; i < dateCount; i++) {
    const dateLocator = articleDates.nth(i);

    // DEBUG: log date text for debugging
    // const dateText = await dateLocator.innerText();
    // console.log(`Article ${i + 1}: ${dateText}`);

    await expect(dateLocator).toBeVisible();
  }

  console.log('All articles on Cyklistika page have a visible date.');

  // Step 8: Find all clickable article links on the page
  const articles = page.locator('a.article-link, a[data-ctcomp-part="opener-content"]');

  // Step 9: Count and log all articles
  const articleCount = await articles.count();
  console.log(`Found ${articleCount} articles on the page.`);

  // DEBUG: print all article titles 
  for (let i = 0; i < articleCount; i++) {
    const title = await articles.nth(i).locator('h2').innerText().catch(() => '[no title]');
  // DEBUG: console.log(`Article ${i + 1}: ${title}`);
  }

  // Step 10: Find first non-video article
  let nonVideoArticleFound = false;

  for (let i = 0; i < articleCount; i++) {
    const article = articles.nth(i);
    const title = await article.locator('h2').innerText().catch(() => '[no title]');

    // Check if the article has a video badge (span with icon--video class)
    const videoBadge = article.locator('span.icon--video');
    const hasVideo = await videoBadge.count() > 0;

    if (!hasVideo) {
      console.log(`-> Found first non-video article: "${title}" (index ${i + 1})`);

      // DEBUG: highlight article link visually
      // await article.evaluate(el => el.style.outline = '3px solid green');
      // await page.pause();

      // Step 11: Click to open the first non-video article
      await article.click();
      // await page.pause();

      // Step 12: Wait for new page to load
      await page.waitForLoadState('domcontentloaded');

      // Step 13a: Verify presence of "Autor" heading and name
      const authorHeading = page.getByRole('heading', { name: 'Autor' });
      await expect(authorHeading).toBeVisible();

      const authorName = authorHeading.locator('xpath=following-sibling::span[1]');
      await expect(authorName).toBeVisible();

      const authorText = await authorName.innerText();
      console.log(`Author found: ${authorText}`);

      // Step 13b: Verify presence of "Zdroj" heading and name
      const sourceHeading = page.getByRole('heading', { name: 'Zdroj' });
      await expect(sourceHeading).toBeVisible();

      const sourceName = sourceHeading.locator('xpath=following-sibling::span[1]');
      await expect(sourceName).toBeVisible();

      const sourceText = await sourceName.innerText();
      console.log(`Source found: ${sourceText}`);

      // await page.pause();

      // Step 14: Check and verify "Související články" section
      const relatedSection = page.locator('div.related-articles');
      await expect(relatedSection).toBeVisible();
      console.log('-> Related articles section is visible.');

      // Find all related article links inside the section
      const relatedArticles = relatedSection.locator('a[data-ctcomp-part="article-link"]');
      const relatedCount = await relatedArticles.count();
      console.log(`Found ${relatedCount} related articles.`);

      if (relatedCount > 0) {
        // Get first related article link
        const firstRelatedArticle = relatedArticles.first();
        // Get its href and check if it belongs to "Cyklistika"
        const href = await firstRelatedArticle.getAttribute('href');
        console.log(`First related article href: ${href}`);

        expect(href).toContain('/cyklistika/');
        console.log('-> First related article is from Cyklistika section.');

        // DEBUG: highlight first related article visually
        // await firstRelatedArticle.evaluate(el => {
        //   el.style.outline = '3px solid blue';
        //   el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // });

        // await page.pause();
      } else {
        console.log('No related articles found inside the section. Skipping URL check.');
      }

      nonVideoArticleFound = true;
      break;
    } else {
      // DEBUG: console.log(`Skipping video article: "${title}"`);
    }
  }

  // Final fallback if no non-video article was found
  if (!nonVideoArticleFound) {
    console.log('No non-video article found!');
  }
});