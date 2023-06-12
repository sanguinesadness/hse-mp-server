import { Injectable } from '@nestjs/common';
import { getPageWebDriver } from 'common/utils';

@Injectable()
export class AppService {
  public async getPageSource(url: string): Promise<string | null> {
    const driver = await getPageWebDriver(url);

    try {
      return await driver.getPageSource();
    } catch {
      return null;
    } finally {
      await driver.quit();
    }
  }
}
