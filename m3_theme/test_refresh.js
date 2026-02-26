const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('http://localhost:8000/app/customer', {waitUntil: 'networkidle2'});

    const issues = await page.evaluate(() => {
        let btn = document.querySelector('.btn-refresh, .page-icon-group button[title="Refresh"]');
        if (!btn) return "No refresh button found!";
        
        let rect = btn.getBoundingClientRect();
        let center = {x: rect.x + rect.width/2, y: rect.y + rect.height/2};
        let elOver = document.elementFromPoint(center.x, center.y);
        
        return {
            btnHTML: btn.outerHTML,
            btnRect: rect,
            elementAtPoint: elOver ? elOver.tagName + '.' + elOver.className + '#' + elOver.id : null,
            pointerEvents: window.getComputedStyle(btn).pointerEvents
        };
    });
    
    console.log(JSON.stringify(issues, null, 2));
    await browser.close();
})();
