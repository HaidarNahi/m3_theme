const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    // capture network requests
    page.on('request', request => {
        if (request.url().includes('/api/')) console.log('REQ:', request.url());
    });

    await page.goto('http://localhost:8000/app/customer', {waitUntil: 'networkidle2'});

    // click refresh button
    console.log("Clicking refresh...");
    await page.evaluate(() => {
        let btn = document.querySelector('button[data-original-title="Reload List"], button[title="Refresh"]');
        if (btn) btn.click();
        else console.log("NO REFRESH BTN FOUND");
    });
    
    await new Promise(r => setTimeout(r, 2000));
    console.log("Done checking click.");
    await browser.close();
})();
