import dialog from "./js/dialog.js";
import PortfolioLocalStorage from "./js/PortfolioLocalStorage.js";
import currentPortfolioStocks from "./js/currentPortfolioStocks.js";
import stockCard from "./js/stockCard.js";
import utility from "./js/utility.js";
import control from "./js/control.js";
import render from "./js/render.js";

const init = function () {
  PortfolioLocalStorage.getAllStocks().forEach((stock) => {
    currentPortfolioStocks.stocks.push(stock);
  });
};

init();

// control.deletePortfolio();

render.portfolio();
control.buttonsON();

const allGain = document.querySelectorAll(".overall-gain");
console.log(allGain);
allGain.forEach((gain) => {
  console.log(gain);
});

const deleteIndividualStockBtn = document.querySelectorAll(".delete-btn");
console.log(deleteIndividualStockBtn);

const deleteAll = document.querySelector("#delete-all-stock");
console.log(deleteAll);
console.log(typeof deleteAll);
