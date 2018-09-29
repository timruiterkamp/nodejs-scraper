const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://hackernoon.com/tagged/software-development';
    const tags = ['data science', 'machine learning', 'javascript'];

    await page.goto(url);

    const articles = await page.evaluate(() => 
        
        Array.from(document.querySelectorAll('div.postArticle'))
        .filter((article) => {
            return article.querySelector('h3').textContent.toLowerCase().includes('javascript');
        })
        .map((article) => ({
            title: article.querySelector('h3').textContent.trim(),
            url: article.querySelector('a').href
        }))
        
    );
    
    console.log(articles);
    let data = JSON.stringify(articles);
    fs.writeFileSync('data.json', data);

    await browser.close();
})();