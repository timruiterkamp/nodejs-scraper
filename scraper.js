const puppeteer = require('puppeteer');
const fs = require('fs');

const CONFIG = {
  subjects: [
    'engineer',
    'developer',
    'lambda',
  ],
  maxArticles: 20,
}


function extractItems() {
  const extractedElements = document.querySelectorAll('div.postArticle');
  const items = [];
  for (let element of extractedElements) {
    console.log(element.innerText)
    const memo = {
      title: element.querySelector('h3') ? element.querySelector('h3').innerText : '',
      excerpt: element.querySelector('p') ? element.querySelector('p').innerText : '',
      // you're probably not getting what you want here - the first a-element is the author
      url: element.querySelector('a') ? element.querySelector('a').href : '',
      // the line below tries to get the href to the article, but i suspect there's some JS magic preventing it from extracting the correct url
      // url: element.querySelector('a:first-of-type') ? element.querySelector('a:nth-of-type(2)').href : '',
    }
    items.push(memo);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch (e) { console.log(e) }
  return items;
}

(async () => {

  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto('https://hackernoon.com/tagged/software-development');

  // Scroll and extract items from the page.
  let items = await scrapeInfiniteScrollItems(page, extractItems, CONFIG.maxArticles);

  // Filter articles
  items = items.filter(item =>
    CONFIG.subjects.some(subject =>
      item.title.indexOf(subject) >= 0 || item.excerpt.indexOf(subject) >= 0
    )
  )

  // Save extracted items to a file.
  fs.writeFileSync('./data.json', JSON.stringify(items, null, 2) + '\n');

  // Close the browser.
  await browser.close();
})();
