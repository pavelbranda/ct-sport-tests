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
  const dateCount = await articleDates.count();

  // Step 6: Verify each date element is visible
  for (let i = 0; i < dateCount; i++) {
    const dateLocator = articleDates.nth(i);
    await expect(dateLocator).toBeVisible();
  }
  console.log('-> All articles on Cyklistika page have a visible date.');

  // Step 7: Find all clickable article links on the page
  const articles = page.locator('a.article-link, a[data-ctcomp-part="opener-content"]');
  const articleCount = await articles.count();

  // Step 8: Find first non-video article
  let nonVideoArticleFound = false;

  for (let i = 0; i < articleCount; i++) {
    const article = articles.nth(i);
    const title = await article.locator('h2').innerText().catch(() => '[no title]');

    const videoBadge = article.locator('span.icon--video');
    const hasVideo = await videoBadge.count() > 0;

    if (!hasVideo) {
      console.log(`-> Found first non-video article: "${title}" (index ${i + 1})`);

      // Step 9: Click to open the first non-video article
      await article.click();
      await page.waitForLoadState('domcontentloaded');

      // Step 10a: Verify presence of "Autor" heading and name
      const authorHeading = page.getByRole('heading', { name: 'Autor' });
      await expect(authorHeading).toBeVisible();

      const authorName = authorHeading.locator('xpath=following-sibling::span[1]');
      await expect(authorName).toBeVisible();

      const authorText = await authorName.innerText();
      console.log(`Author found: ${authorText}`);

      // Step 10b: Verify presence of "Zdroj" heading and name
      const sourceHeading = page.getByRole('heading', { name: 'Zdroj' });
      await expect(sourceHeading).toBeVisible();

      const sourceName = sourceHeading.locator('xpath=following-sibling::span[1]');
      await expect(sourceName).toBeVisible();

      const sourceText = await sourceName.innerText();
      console.log(`Source found: ${sourceText}`);

      // Step 11: Check and verify "Související články" section
      const relatedSection = page.locator('div.related-articles');
      await expect(relatedSection).toBeVisible();
      console.log('-> Related articles section is visible.');

      const relatedArticles = relatedSection.locator('a[data-ctcomp-part="article-link"]');
      const relatedCount = await relatedArticles.count();

      if (relatedCount > 0) {
        const firstRelatedArticle = relatedArticles.first();
        const href = await firstRelatedArticle.getAttribute('href');

        expect(href).toContain('/cyklistika/');
        console.log('-> First related article is from Cyklistika section.');
      } else {
        console.log('No related articles found inside the section. Skipping URL check.');
      }

      nonVideoArticleFound = true;
      break;
    }
  }
  
  if (!nonVideoArticleFound) {
    console.log('No non-video article found!');
  }
});