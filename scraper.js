const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // this url can be changed
    // if it is changed, you need to update the query selectors beneath.
    const url = 'https://medium.com/topic/technology';

    await page.goto(url);
    // TODO: 
    // h3 is way too general, need an concrete DOM element
    const articles = await page.evaluate(() => 
        Array.from(document.querySelectorAll('h3'))
        .map(streamItem => ({
            title: streamItem.textContent.trim(),
            url: streamItem.querySelector('a').href
        }))
        
    );

    // TODO / IDEAS:
    // output file to an index file
    // add to array when new items come in
    // Setup front-end to use the data
    
    let data = JSON.stringify(articles);
    fs.writeFileSync('data.json', data);
    await browser.close();
})();