import { Prisma } from '@prisma/client';
import { getPageWebDriver } from 'common/utils/get-page-web-driver';
import { By } from 'selenium-webdriver';

export async function getOzonProducts(
  url: string
): Promise<Array<Prisma.TopProductCreateInput> | null> {
  const driver = await getPageWebDriver(url);

  const pageHeight: number = await driver.executeScript(
    'return document.body.scrollHeight'
  );

  const windowHeight: number = await driver.executeScript(
    'return window.innerHeight'
  );

  let currentHeight = windowHeight;
  while (currentHeight < pageHeight) {
    await driver.executeScript(`window.scrollTo(0, ${currentHeight})`);
    currentHeight += windowHeight;
  }

  try {
    const productElements = await driver.findElements(
      By.css('#paginatorContent > div > div > div')
    );

    const topProducts: Array<Prisma.TopProductCreateInput> = [];

    for (const element of productElements) {
      const topProduct: Prisma.TopProductCreateInput = {
        url: '',
        image: '',
        title: '',
        newPrice: '',
        oldPrice: '',
        rating: null,
        comments: null
      };

      try {
        const url = await element
          .findElement(By.css('a.tile-hover-target'))
          .getAttribute('href');
        topProduct.url = url.trim();
      } catch {}

      try {
        const image = await element
          .findElement(By.css('img'))
          .getAttribute('src');
        topProduct.image = image.trim();
      } catch {}

      try {
        const title = await element
          .findElement(By.css('.tile-hover-target > span > span'))
          .getText();

        topProduct.title = title.trim();
      } catch {}

      try {
        const newPrice = await element
          .findElement(By.css('div.oi0 > div.d7-a.ki9 > span > span.d7-a2'))
          .getText();
        topProduct.newPrice = newPrice.trim();
      } catch {
        try {
          const newPrice = await element
            .findElement(By.css('div.oi0 > div.d6-a.ki9 > div.d6-a0'))
            .getText();
          topProduct.newPrice = newPrice.trim();
        } catch {}
      }

      try {
        const oldPrice = (
          await element
            .findElement(
              By.css('div.oi0 > div.d7-a.ki9 > span > span.d7-b1.d7-a7')
            )
            .getText()
        ).trim();
        topProduct.oldPrice = oldPrice !== 'будет стоить' ? oldPrice : null;
      } catch {
        try {
          const oldPrice = (
            await element
              .findElement(By.css('div.oi0 > div.d6-a.ki9 > div.d6-b2'))
              .getText()
          ).trim();
          topProduct.oldPrice = oldPrice !== 'будет стоить' ? oldPrice : null;
        } catch {}
      }

      try {
        const rating = (
          await element
            .findElement(
              By.css('div.oi0 > div.ki9 > div > span:nth-child(1) > span')
            )
            .getText()
        ).trim();
        topProduct.rating =
          rating && !isNaN(parseFloat(rating)) ? parseFloat(rating) : null;
      } catch {}

      try {
        const comments = (
          await element
            .findElement(
              By.css('div.oi0 > div.ki9 > div > span:nth-child(2) > span')
            )
            .getText()
        )
          .replace('·', '')
          .trim();

        topProduct.comments = comments ? parseInt(comments) : null;
      } catch {}

      topProducts.push(topProduct);
    }

    return topProducts;
  } catch {
    return null;
  } finally {
    await driver.quit();
  }
}
