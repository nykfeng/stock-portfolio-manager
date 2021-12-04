import dialog from "./js/dialog.js";
import PortfolioLocalStorage from "./js/PortfolioLocalStorage.js";
import currentPortfolioStocks from "./js/currentPortfolioStocks.js";
import control from "./js/control.js";
import render from "./js/render.js";

const init = function () {
  PortfolioLocalStorage.getAllStocks().forEach((stock) => {
    currentPortfolioStocks.stocks.push(stock);
  });

  ["FB", "AMZN", "AAPL", "NVDA", "GOOG"].forEach(async (stock) => {
    render.stockCard(stock);
  });
};

init();

if (currentPortfolioStocks.stocks.length === 0) {
  control.initializeWithSampleData();
}

render.portfolio();
control.buttonsON();
