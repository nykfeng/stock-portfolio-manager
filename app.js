import dialog from "./js/dialog.js";
import BrowserLocalStorage from "./js/BrowserLocalStorage.js";
import currentPortfolio from "./js/currentPortfolio.js";
import currentStockCards from "./js/currentStockCards.js";
import control from "./js/control.js";
import render from "./js/render.js";

const init = function () {
  const portfolioStocks = BrowserLocalStorage.getAllStocks();
  const stockCards = BrowserLocalStorage.getAllStockCards();

  // If there are stocks saved, pull from localStorage
  // else initiate with sample data
  if (portfolioStocks.length > 0) {
    portfolioStocks.forEach((stock) => {
      currentPortfolio.stocks.push(stock);
    });
  } else {
    control.initializeSamplePortfolio();
  }

  if (stockCards.length > 0) {
    BrowserLocalStorage.getAllStockCards().forEach((stock) => {
      currentStockCards.stocks.push(stock);
    });
  } else {
    control.initializeSampleStockCards();
  }
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
