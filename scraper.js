const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://medium.com/';

    await page.goto(url);

    //problems to solve:
    // only tackles 1 item at a time, due to medium DOM setup
    // tried it with another link, that worked fine 
    const articles = await page.evaluate(() => 
        Array.from(document.querySelectorAll('.streamItem'))
        .map(streamItem => ({
            title: streamItem.querySelector('h3').textContent.trim(),
            url: streamItem.querySelector('.ds-link').href
        }))
    );

    // TODO / IDEAS:
    // output file to an index file
    // add to array when new items come in
    // Setup front-end to use the data

    console.log(articles);
    await browser.close();
})();