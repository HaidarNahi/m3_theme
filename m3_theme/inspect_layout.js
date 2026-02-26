const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('http://localhost:8000/app/customer', { waitUntil: 'networkidle2' });

    const results = await page.evaluate(() => {
        const getStyle = (s) => {
            let el = document.querySelector(s);
            if (!el) return null;
            let st = window.getComputedStyle(el);
            let rect = el.getBoundingClientRect();
            return {
                sel: s,
                rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
                padL: st.paddingLeft,
                padR: st.paddingRight,
                margL: st.marginLeft,
                w: st.width,
                boxSiz: st.boxSizing,
                display: st.display
            };
        };

        return {
            body: getStyle('body'),
            pageContainer: getStyle('.page-container'),
            pageHead: getStyle('.page-head'),
            layoutMainSection: getStyle('.layout-main-section'),
            refreshBtn: getStyle('.btn-icon[data-original-title="Refresh"]') || getStyle('.page-icon-group > span'),
            sidebar: getStyle('#m3-fixed-sidebar')
        };
    });

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
})();
