import { Builder, Capabilities, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

export async function getPageWebDriver(url: string): Promise<WebDriver> {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--start-maximized'); // Открывать окно в полноэкранном режиме

  const driver = await new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(chromeOptions)
    .build();

  const resolution = await driver.executeScript(`
    return {
      width: window.screen.availWidth,
      height: window.screen.availHeight
    };
  `);

  await driver.manage().window().setRect(resolution);

  await driver.get(url);
  return driver;
}
