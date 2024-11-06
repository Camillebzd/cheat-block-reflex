import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://blockreflex.ocvlabs.com/');

  const parentDivSelector = 'div.grid.content-center.w-full.h-full.grid-cols-4.gap-1';
  // Get all child divs within the parent div
  const childDivs = await page.$$eval(`${parentDivSelector} > div`, nodes =>
    nodes.map(node => ({
      html: node.innerHTML,
      className: node.className,
      dataset: node.dataset
    }))
  );

  console.log(childDivs);

  await browser.close();
})();

// npx ts-node cheat.ts