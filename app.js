import PortfolioStocksAPI from "./js/PortfolioStocksAPI.js";
import stockCard from "./js/stockCard.js";
import utility from "./js/utility.js";

const portfolioTableEl = document.getElementById("portfolio-table");
const stockTickerInputEl = document.getElementById("stock-ticker");
const stockEntryPriceInputEl = document.getElementById("entry-price");
const stockSharesInputEl = document.getElementById("number-shares");
const addStockBtn = document.getElementById("submit-stock");
const clearPortfolioBtn = document.getElementById("delete-all-stock");
const tableHeaderEls = document.querySelectorAll("th");

// [stockEntryPriceInputEl, stockSharesInputEl].forEach((input) => {
//   input.addEventListener("keyup", function () {
//     this.value = utility.formatNumber(
//       parseFloat(this.value.replace(/[,]+/g, ""))
//     );
//   });
// });

stockSharesInputEl.addEventListener("keyup", function () {
  this.value = utility.formatNumber(this.value.replace(/[,]+/g, ""));
});

stockTickerInputEl.addEventListener("keyup", function () {
  this.value = this.value.toUpperCase();
});

let html;
const stocks = [];
PortfolioStocksAPI.getAllStocks().forEach((stock) => {
  stocks.push(stock);
});

const addStockFromInput = function () {
  const stockTicker = document
    .getElementById("stock-ticker")
    .value.toUpperCase();
  const stockEntry = document.getElementById("entry-price").value;
  const stockQuantity = document
    .getElementById("number-shares")
    .value.replace(/[,]+/g, "");

  if (!stockTicker || !stockEntry || !stockQuantity) return;

  PortfolioStocksAPI.addStock({
    ticker: stockTicker,
    shares: +stockQuantity,
    entry: +stockEntry,
    acquiredDate: new Date().toISOString(),
  });

  console.log(localStorage.getItem("portfolio-stocks"));

  removePortfolioHtml();
  renderPortfolio();
};

// Add stocks to portfolio
addStockBtn.addEventListener("click", addStockFromInput);

// Clear the portfolio
clearPortfolioBtn.addEventListener("click", function () {
  localStorage.clear();
  removePortfolioHtml();
});

const removePortfolioHtml = function () {
  const stockInfoRow = document.querySelectorAll(".stock-info-row");
  for (const el of stockInfoRow) {
    el.remove();
  }
};

// localStorage.clear();
// stocks.forEach((stock) => PortfolioStocksAPI.addStock(stock));

console.log(localStorage.getItem("portfolio-stocks"));

const fetchStockInfo = async function (stock) {
  const res = await fetch(
    `https://cloud.iexapis.com/stable/stock/${stock.ticker}/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
  );
  const data = await res.json();
  return data;
};

const renderStockInfo = async function (stock) {
  const stockAPIData = await fetchStockInfo(stock);

  await storingAPIDataToLocal(stockAPIData);
  calculatingLocalStockData();

  return portfolioRowHtml(stock);
};

const portfolioRowHtml = function (stock) {
  return `
  <tr class="stock-info-row ticker-${stock.ticker}">
      <td class="ticker">${stock.ticker}</td>
      <td class="shares">${utility.formatNumber(stock.shares)}</td>
      <td class="entry-price">$${utility.formatNumber(
        stock.entry.toFixed(2)
      )}</td> 
      <td class="latest-price">$${utility.formatNumber(
        stock.latestPrice.toFixed(2)
      )}</td> 
      <td class="total-paid">$${utility.formatNumber(
        stock.totalPaid.toFixed(2)
      )}</td> 
      <td class="latest-value">$${utility.formatNumber(
        (stock.shares * stock.latestPrice).toFixed(2)
      )}</td> 
      <td class="daily-percentage ${formattPortfolioColor(
        stock.changePercent
      )}">${utility.formatNumber((stock.changePercent * 100).toFixed(2))}%</td> 
      <td class="daily-change ${formattPortfolioColor(
        stock.changePercent
      )}">$${utility.formatNumber(stock.change.toFixed(2))}</td> 
      <td class="overall-gain">$${utility.formatNumber(
        stock.overallGain.toFixed(2)
      )}</td>
      <td class="overall-gain-percent ${formattPortfolioColor(
        stock.overallGainPercent
      )}">${utility.formatNumber(stock.overallGainPercent.toFixed(2))}%</td>
    </tr>
  `;
};

const renderPortfolio = function () {
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  /*
  // Rendering from Local Storage
  PortfolioStocksAPI.getAllStocks().forEach(async (stock) => {
    html = await renderStockInfo(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  });
  */

  // Rendering from local array memory, which has been updated by pulling Local Storage first
  stocks.forEach(async (stock) => {
    html = await renderStockInfo(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  });
};

const formattPortfolioColor = function (plusMinus) {
  return plusMinus >= 0
    ? "green-price-box portfolio-box"
    : "red-price-box portfolio-box";
};

const storingAPIDataToLocal = async function (APIData) {
  const index = stocks.findIndex((stock) => stock.ticker === APIData.symbol);
  if (index > -1) {
    stocks[index].change = APIData.change * stocks[index].shares;
    stocks[index].changePercent = APIData.changePercent;
    stocks[index].latestPrice = APIData.latestPrice;
  }
};

const calculatingLocalStockData = function () {
  stocks.forEach((stock) => {
    stock.totalPaid = stock.shares * stock.entry;
    stock.marketValue = stock.shares * stock.latestPrice;
    stock.overallGain = stock.shares * stock.latestPrice - stock.totalPaid;
    stock.overallGainPercent =
      ((stock.latestPrice - stock.entry) / stock.entry) * 100;
  });
};

const sortingPortfolioColumns = function (column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  stocks.sort((a, b) => {
    return a[column] < b[column] ? dirModifier * 1 : dirModifier * -1;
  });
};

let newStocks = sortingPortfolioColumns(stocks);
console.log("Sorting the array ");
console.log(newStocks);

tableHeaderEls.forEach(function (tableHeader) {
  tableHeader.addEventListener("click", function () {
    const asc = this.classList.contains("th-sort-asc");
    this.classList.remove("th-sort-pending");

    sortingPortfolioColumns(tableHeader.dataset.column, asc);
    // this.classList.remove("th-sort-asc", "th-sort-desc");
    this.classList.toggle("th-sort-asc", !asc);
    this.classList.toggle("th-sort-desc", asc);

    removePortfolioHtml();
    reArrangePortfolioBySort();
  });
});

const reArrangePortfolioBySort = function () {
  const portfolioBodyEl = document.querySelector("tbody");
  while (portfolioBodyEl.firstChild) {
    portfolioBodyEl.removeChild(portfolioBodyEl.firstChild);
  }
  stocks.forEach((stock) => {
    html = portfolioRowHtml(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  });
};

renderPortfolio();
stockCard("fb");
stockCard("nvda");
stockCard("amzn");
stockCard("aapl");
stockCard("goog");
console.log(stocks);
