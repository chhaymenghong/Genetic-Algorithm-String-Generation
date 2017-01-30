import { GeneticPage } from './app.po';

describe('genetic App', function() {
  let page: GeneticPage;

  beforeEach(() => {
    page = new GeneticPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
