import { HomeAccountingPage } from './app.po';

describe('home-accounting App', () => {
  let page: HomeAccountingPage;

  beforeEach(() => {
    page = new HomeAccountingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('hacc works!');
  });
});
