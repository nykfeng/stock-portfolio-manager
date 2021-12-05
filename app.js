import dialog from "./js/dialog.js";
import BrowserLocalStorage from "./js/BrowserLocalStorage.js";
import currentPortfolio from "./js/currentPortfolio.js";
import currentStockCards from "./js/currentStockCards.js";
import control from "./js/control.js";
import render from "./js/render.js";

const init = function () {
  BrowserLocalStorage.getAllStocks().forEach((stock) => {
    currentPortfolio.stocks.push(stock);
  });

  BrowserLocalStorage.getAllStockCards().forEach((stock) => {
    currentStockCards.stocks.push(stock);
  });
};

init();

// Sample data for demo
// if (currentPortfolio.stocks.length === 0) {
//   control.initializeSamplePortfolio();
//   control.initializeSampleStockCards();
// }

render.indexCharts();
render.portfolio();

control.buttonsON();

currentStockCards.stocks.forEach(async (stock) => {
  render.stockCard(stock);
});

setTimeout(() => {
  console.log("---------------------------------");
  console.log(currentPortfolio.overview);

  currentPortfolio.overview.forEach((overview) => {
    console.log(overview);
  }, 5000);
});

// render.portfolioOverview();

// setTimeout(render.portfolioOverview, 1000);
