import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  Product,
  ProductCompetitor,
  TopProduct,
  User
} from '@prisma/client';
import {
  extractKeywords,
  getOzonProducts,
  getPageWebDriver
} from 'common/utils';
import {
  OZON_TOP_SELLS_PAGE_URL,
  OZON_WEEKLY_HITS_PAGE_URL
} from 'ozon/constants';
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

  public async checkAllProductsCompetitors(userId: string) {
    const userProducts = await this.prisma.product.findMany({
      where: {
        userId: userId
      }
    });

    const result = [];

    for (const product of userProducts) {
      const competitors = await this.checkProductCompetitors(
        userId,
        product.id
      );
      result.push({
        product: {
          id: product.id,
          title: product.name,
          competitors
        }
      });
    }

    return result;
  }

  public async checkProductCompetitors(
    userId: string,
    productId: string
  ): Promise<Array<Prisma.ProductCompetitorCreateInput> | null> {
    const product = await this.prisma.product.findFirst({
      where: { userId, id: productId }
    });
    if (!product) {
      return null;
    }
    const keywordName = extractKeywords(product.name).slice(0, 3).join(' ');
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
      currentHeight += windowHeight;
    }

    try {
      const productElements = await driver.findElements(
        By.css('#paginatorContent > div > div > div')
      );

      const competitorProducts: Array<Prisma.ProductCompetitorCreateInput> = [];

      for (const element of productElements) {
        const competitorProduct: Prisma.ProductCompetitorCreateInput = {
          url: '',
          image: '',
          title: '',
          newPrice: '',
          oldPrice: '',
          rating: null,
          comments: null,
          product: { connect: { id: productId } }
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

          if (title.trim() === product.name) {
            continue;
          }

          competitorProduct.title = title.trim();
        } catch {}

        try {
          const newPrice = await element
            .findElement(By.css('div.o0i > div.d7-a.k9i > span > span.d7-a2'))
            .getText();
          competitorProduct.newPrice = newPrice.trim();
        } catch {
          try {
            const newPrice = await element
              .findElement(By.css('div.o0i > div.d6-a.k9i > div.d6-a0'))
              .getText();
            competitorProduct.newPrice = newPrice.trim();
          } catch {}
        }

        try {
          const oldPrice = (
            await element
              .findElement(
                By.css('div.o0i > div.d7-a.k9i > span > span.d7-b1.d7-a7')
              )
              .getText()
          ).trim();
          competitorProduct.oldPrice =
            oldPrice !== 'будет стоить' ? oldPrice : null;
        } catch {
          try {
            const oldPrice = (
              await element
                .findElement(By.css('div.o0i > div.d6-a.k9i > div.d6-b2'))
                .getText()
            ).trim();
            competitorProduct.oldPrice =
              oldPrice !== 'будет стоить' ? oldPrice : null;
          } catch {}
        }

        try {
          const rating = (
            await element
              .findElement(
                By.css('div.o0i > div > div > span:nth-child(1) > span')
              )
              .getText()
          ).trim();
          competitorProduct.rating =
            rating && !isNaN(parseFloat(rating)) ? parseFloat(rating) : null;
        } catch {
          try {
            const rating = (
              await element
                .findElement(
                  By.css('div.o0i > div > div > div > span:nth-child(1) > span')
                )
                .getText()
            ).trim();
            competitorProduct.rating =
              rating && !isNaN(parseFloat(rating)) ? parseFloat(rating) : null;
          } catch {}
        }

        try {
          const comments = (
            await element
              .findElement(
                By.css('div.o0i > div > div > span:nth-child(2) > span')
              )
              .getText()
          )
            .replace('·', '')
            .trim();

          competitorProduct.comments = comments ? parseInt(comments) : null;
        } catch {
          try {
            const comments = (
              await element
                .findElement(
                  By.css('div.o0i > div > div > div > span:nth-child(2) > span')
                )
                .getText()
            )
              .replace('·', '')
              .trim();

            competitorProduct.comments = comments ? parseInt(comments) : null;
          } catch {}
        }

        competitorProducts.push(competitorProduct);
        try {
          if (competitorProduct.url && competitorProduct.title) {
            void this.createProductCompetitor(competitorProduct);
          }
        } catch {}
      }

      return competitorProducts;
    } catch {
      return null;
    } finally {
      await driver.quit();
    }
  }

  public async checkTopProducts(): Promise<Array<Prisma.TopProductCreateInput> | null> {
    try {
      const topSellsProducts = await getOzonProducts(OZON_TOP_SELLS_PAGE_URL);
      const weeklyHitProducts = await getOzonProducts(
        OZON_WEEKLY_HITS_PAGE_URL
      );
      const allProducts = [...topSellsProducts, ...weeklyHitProducts];

      for (const product of allProducts) {
        try {
          if (product.title && product.url) {
            void this.createTopProduct(product);
          }
        } catch {}
      }
      return allProducts;
    } catch {
      return null;
    }
  }

  public async clearProductCompetitorDuplicates(): Promise<any> {
    const records = await this.prisma.productCompetitor.findMany();

    const duplicateIds = [];
    const seenRecords = {};

    records.forEach((record) => {
      const key = record.title + record.image;

      if (seenRecords[key]) {
        duplicateIds.push(record.id);
      } else {
        seenRecords[key] = true;
      }
    });

    return await this.prisma.productCompetitor.deleteMany({
      where: {
        id: {
          in: duplicateIds
        }
      }
    });
  }

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

  public async createProductCompetitor(
    data: Prisma.ProductCompetitorCreateInput
  ): Promise<ProductCompetitor> {
    const existingItem = await this.prisma.productCompetitor.findFirst({
      where: {
        AND: {
          image: data.image,
          title: data.title
        }
      }
    });
    if (existingItem) {
      return await this.prisma.productCompetitor.update({
        where: { id: existingItem.id },
        data
      });
    }
    return await this.prisma.productCompetitor.create({ data });
  }

  public async createTopProduct(
    data: Prisma.TopProductCreateInput
  ): Promise<TopProduct> {
    const existingProduct = await this.prisma.topProduct.findFirst({
      where: {
        AND: {
          url: data.url,
          title: data.title
        }
      }
    });
    if (existingProduct) {
      return await this.prisma.topProduct.update({
        where: { id: data.id },
        data
      });
    }
    return await this.prisma.topProduct.create({ data });
  }

  public async getAllProductsCompetitors(userId: string, refresh?: boolean) {
    const sortedCompetitors = await this.getSortedProductCompetitors(userId);

    const groupedCompetitors = new Map();

    for (const competitor of sortedCompetitors) {
      const { product, ...rest } = competitor;
      if (!groupedCompetitors.has(product.id)) {
        groupedCompetitors.set(product.id, { ...product, competitors: [] });
      }
      groupedCompetitors.get(product.id).competitors.push(rest);
    }

    if (refresh) {
      try {
        await this.checkAllProductsCompetitors(userId);
      } catch {}
    }

    return Array.from(groupedCompetitors.values());
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

  public async getProductCompetitors(
    userId: string,
    productId: string,
    refresh?: boolean
  ) {
    const competitors = await this.prisma.productCompetitor.findMany({
      where: {
        productId,
        product: {
          userId
        }
      }
    });

    if (refresh) {
      try {
        await this.checkProductCompetitors(userId, productId);
      } catch {}
    }

    return competitors;
  }

  public async getSortedProductCompetitors(userId: string) {
    const allCompetitors = await this.prisma.productCompetitor.findMany({
      where: {
        product: {
          userId
        }
      },
      include: {
        product: true
      },
      orderBy: {
        comments: 'desc'
      }
    });

    const competitorsWithComments = allCompetitors.filter(
      (competitor) => competitor.comments !== null
    );
    const competitorsWithoutComments = allCompetitors.filter(
      (competitor) => competitor.comments === null
    );

    return competitorsWithComments.concat(competitorsWithoutComments);
  }

  public async getTopProducts(refresh?: boolean): Promise<Array<TopProduct>> {
    const products = await this.prisma.topProduct.findMany({
      orderBy: { comments: 'desc' }
    });

    const productsWithComments = products.filter(
      (competitor) => competitor.comments !== null
    );
    const productsWithoutComments = products.filter(
      (competitor) => competitor.comments === null
    );

    const sortedProducts = productsWithComments.concat(productsWithoutComments);

    if (refresh) {
      try {
        await this.checkTopProducts();
      } catch {}
    }

    return sortedProducts;
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
