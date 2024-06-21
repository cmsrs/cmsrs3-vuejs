import    './main.js';

describe('Main.js', () => {
  it('attache main', async () => {
    document.body.innerHTML =
    '<div id="app">' +
    '</div>';

    const pElement = document.getElementById('app');
    expect(pElement).toBeTruthy();
  });
});