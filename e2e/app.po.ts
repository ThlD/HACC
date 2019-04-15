import { browser, element, by } from 'protractor';

export class HomeAccountingPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('hacc-root h1')).getText();
  }
}
