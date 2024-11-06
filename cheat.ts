import puppeteer, { Page } from 'puppeteer';

async function revealIcons(page: Page, parentDivSelector: string) {
  // Get all child divs within the parent div
  const childDivs = await page.$$(parentDivSelector + ' > div');

  const iconData: { index: number, icon: string }[] = [];

  for (let i = 0; i < childDivs.length; i++) {
    const div = childDivs[i];

    // Click to reveal the icon
    await div.click();
    // await page.waitForTimeout(500); // Wait a bit for the icon to be revealed

    // Get the icon value
    const icon = await page.evaluate(div => div.innerHTML, div);

    iconData.push({ index: i, icon });

    // Click again to hide the icon (optional, based on game behavior)
    // await div.click();
    // await page.waitForTimeout(500); // Wait a bit for the icon to be hidden
    if (i % 2 !== 0)
      await new Promise(r => setTimeout(r, 500));
  }

  return iconData;
}

async function clickIdenticalPairs(page: Page, parentDivSelector: string, iconData: { index: number, icon: string }[]) {
  const childDivs = await page.$$(parentDivSelector + ' > div');

  // Find pairs
  const pairs: { [icon: string]: number[] } = {};
  iconData.forEach(({ index, icon }) => {
    if (!pairs[icon]) {
      pairs[icon] = [];
    }
    pairs[icon].push(index);
  });

  // Click pairs
  for (const indices of Object.values(pairs)) {
    if (indices.length >= 2) {
      for (let i = 0; i < indices.length; i += 2) {
        const index1 = indices[i];
        const index2 = indices[i + 1];

        if (index1 !== undefined && index2 !== undefined) {
          // Click the first icon
          await childDivs[index1].click();
          // await page.waitForTimeout(500); // Wait a bit between clicks

          // Click the second icon
          await childDivs[index2].click();
          // await page.waitForTimeout(500); // Wait a bit between clicks
          await new Promise(r => setTimeout(r, 500));
 
        }
      }
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://blockreflex.com/'); // Replace with the actual URL of your game

  // Selector for the parent div
  // const parentDivSelector = 'div.grid.content-center.w-full.h-full.grid-cols-4.gap-1';
  const parentDivSelector = 'div.grid.content-center.grid-cols-4.gap-1.p-2.border-2.rounded-2xl.border-transparent';

  // Reveal icons and store their values
  const iconData = await revealIcons(page, parentDivSelector);
  console.log(iconData);

  // Click identical pairs
  await clickIdenticalPairs(page, parentDivSelector, iconData);

  // Close the browser
  // await browser.close();
})();

// npx ts-node cheat.ts