import dialog from "./js/dialog.js";
import PortfolioLocalStorage from "./js/PortfolioLocalStorage.js";
import currentPortfolioStocks from "./js/currentPortfolioStocks.js";
import stockCard from "./js/stockCard.js";
import utility from "./js/utility.js";
import control from "./js/control.js";
import render from "./js/render.js";

// control.initializeWithSampleData();

const init = function () {
  PortfolioLocalStorage.getAllStocks().forEach((stock) => {
    currentPortfolioStocks.stocks.push(stock);
  });
};

init();

render.portfolio();
control.buttonsON();

["FB", "AMZN", "AAPL", "NVDA", "GOOG"].forEach(async (stock) => {
  render.stockCard(stock);
});
