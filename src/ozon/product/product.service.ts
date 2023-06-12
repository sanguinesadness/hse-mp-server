import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Product, User } from '@prisma/client';
import { extractKeywords, getPageWebDriver } from 'common/utils';
import {
  DetailedProductInfoRequestModel,
  ProductInfoRequestModel,
  ProductModel
} from 'ozon/models';
import { ozonProductApi } from 'ozon/ozon-product-api';
import { By } from 'selenium-webdriver';

@Injectable()
export class ProductService {
  private prisma = new PrismaClient();

  public async createOne(data: Prisma.ProductCreateInput): Promise<Product> {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        OR: {
          offerId: data.offerId,
          barcode: data.barcode
        }
      }
    });
    if (existingProduct) {
      return await this.update(existingProduct.id, data);
    }
    return await this.prisma.product.create({ data });
  }

  public async getAllProductsCompetitors(userId: string): Promise<any> {
    const userProducts = await this.prisma.product.findMany({
      where: {
        userId: userId
      }
    });
    const keywordsNames = userProducts.map((product: Product) => {
      return extractKeywords(product.name).join(' ');
    });

    return keywordsNames;
  }

  public async getCompetitorProducts(
    userId: string,
    productId: string,
    count?: number
  ): Promise<any | null> {
    const product = await this.prisma.product.findFirst({
      where: { userId, id: productId }
    });
    if (!product) {
      return null;
    }
    const keywordName = extractKeywords(product.name).join(' ');
    const driver = await getPageWebDriver(
      `https://www.ozon.ru/search/?text=${keywordName}&from_global=true`
    );

    const pageHeight: number = await driver.executeScript(
      'return document.body.scrollHeight'
    );

    const windowHeight: number = await driver.executeScript(
      'return window.innerHeight'
    );

    let currentHeight = windowHeight;
    while (currentHeight < pageHeight) {
      await driver.executeScript(`window.scrollTo(0, ${currentHeight})`);
      // await driver.wait(driver.sleep(1000));
      currentHeight += windowHeight;
    }

    try {
      const productElements = await driver.findElements(
        By.css('#paginatorContent > div > div > div')
      );

      const competitorProducts = [];
      let index = 0;

      for (const element of productElements) {
        if (++index > count) {
          continue;
        }

        const competitorProduct = {
          url: '',
          image: '',
          title: '',
          newPrice: '',
          oldPrice: '',
          rating: '',
          comments: ''
        };

        try {
          const url = await element
            .findElement(By.css('a.tile-hover-target'))
            .getAttribute('href');
          competitorProduct.url = url.trim();
        } catch {}

        try {
          const image = await element
            .findElement(By.css('img'))
            .getAttribute('src');
          competitorProduct.image = image.trim();
        } catch {}

        try {
          const title = await element
            .findElement(By.css('.tile-hover-target > span > span'))
            .getText();
          competitorProduct.title = title.trim();
        } catch {}

        try {
          const newPrice = await element
            .findElement(By.css('div.oi0 > div.d7-a.ki9 > span > span.d7-a2'))
            .getText();
          competitorProduct.newPrice = newPrice.trim();
        } catch {
          try {
            const newPrice = await element
              .findElement(By.css('div.oi0 > div.d6-a.ki9 > div.d6-a0'))
              .getText();
            competitorProduct.newPrice = newPrice.trim();
          } catch {}
        }

        try {
          const oldPrice = await element
            .findElement(
              By.css('div.oi0 > div.d7-a.ki9 > span > span.d7-b1.d7-a7')
            )
            .getText();
          competitorProduct.oldPrice = oldPrice.trim();
        } catch {
          try {
            const oldPrice = await element
              .findElement(By.css('div.oi0 > div.d6-a.ki9 > div.d6-b2'))
              .getText();
            competitorProduct.oldPrice = oldPrice.trim();
          } catch {}
        }

        try {
          const rating = await element
            .findElement(
              By.css('div.oi0 > div.ki9 > div > span:nth-child(1) > span')
            )
            .getText();
          competitorProduct.rating = rating.trim();
        } catch {}

        try {
          const comments = await element
            .findElement(
              By.css('div.oi0 > div.ki9 > div > span:nth-child(2) > span')
            )
            .getText();
          competitorProduct.comments = comments.replace('·', '').trim();
        } catch {}

        competitorProducts.push(competitorProduct);
      }

      return competitorProducts;
    } catch {
      return null;
    } finally {
      await driver.quit();
    }
  }

  public async getDetailedList(
    productsInfo: DetailedProductInfoRequestModel['productsInfo'],
    user: User
  ): Promise<any> {
    if (!productsInfo || productsInfo.length < 1) {
      const allProducts = await ozonProductApi.productList(user);
      productsInfo = allProducts.items.map(({ product_id }) => ({
        product_id
      }));
    }

    const promises = productsInfo.map((productInfo: ProductInfoRequestModel) =>
      ozonProductApi.productInfo(user, productInfo)
    );
    const detailedList = await Promise.all(promises);
    detailedList.forEach((product: Awaited<ProductModel>) => {
      this.createOne(ProductModel.fromServer(product, user.id));
    });
    return detailedList;
  }

  public async update(
    id: string,
    data: Prisma.ProductUpdateInput
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data
    });
  }
}
