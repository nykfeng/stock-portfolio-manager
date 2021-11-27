import PortfolioStocksAPI from "./js/PortfolioStocksAPI.js";
import stockCard from "./js/stockCard.js";
import utility from "./js/utility.js";

const portfolioTableEl = document.getElementById("portfolio-table");
const stockTickerInputEl = document.getElementById("stock-ticker");
const stockEntryPriceInputEl = document.getElementById("entry-price");
const stockSharesInputEl = document.getElementById("number-shares");
const addStockBtn = document.getElementById("submit-stock");
const clearPortfolioBtn = document.getElementById("delete-all-stock");

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

  console.log("stockTicker " + stockTicker);
  console.log("stockEntry " + stockEntry);
  console.log("stockQuantity " + stockQuantity);

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
  const totalPaid = stock.shares * stock.entry;
  const overallGainPercent =
    ((stockAPIData.latestPrice - stock.entry) / stock.entry) * 100;
  return `
  <tr class="stock-info-row ticker-${stock.ticker}">
      <td class="ticker">${stock.ticker}</td>
      <td class="shares">${utility.formatNumber(stock.shares)}</td>
      <td class="entry-price">$${utility.formatNumber(
        stock.entry.toFixed(2)
      )}</td> 
      <td class="latest-price">$${utility.formatNumber(
        stockAPIData.latestPrice.toFixed(2)
      )}</td> 
      <td class="total-paid">$${utility.formatNumber(
        totalPaid.toFixed(2)
      )}</td> 
      <td class="latest-value">$${utility.formatNumber(
        (stock.shares * stockAPIData.latestPrice).toFixed(2)
      )}</td> 
      <td class="daily-percentage ${formattPortfolioColor(
        stockAPIData.changePercent
      )}">${utility.formatNumber(
    (stockAPIData.changePercent * 100).toFixed(2)
  )}%</td> 
      <td class="daily-change ${formattPortfolioColor(
        stockAPIData.changePercent
      )}">$${utility.formatNumber(
    (stock.shares * stockAPIData.change).toFixed(2)
  )}</td> 
      <td class="overall-gain">$${utility.formatNumber(
        (stock.shares * stockAPIData.latestPrice - totalPaid).toFixed(2)
      )}</td>
      <td class="overall-gain-percent ${formattPortfolioColor(
        overallGainPercent
      )}">${utility.formatNumber(overallGainPercent.toFixed(2))}%</td>
    </tr>
  `;
};

const renderPortfolio = function () {
  // const portfolioBodyEl = portfolioTableEl.appendChild(
  //   document.createElement("tbody")
  // );
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  PortfolioStocksAPI.getAllStocks().forEach(async (stock) => {
    html = await renderStockInfo(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  });
};

const formattPortfolioColor = function (plusMinus) {
  return plusMinus >= 0
    ? "green-price-box portfolio-box"
    : "red-price-box portfolio-box";
};

renderPortfolio();
stockCard("fb");
stockCard("nvda");
stockCard("amzn");
stockCard("aapl");
stockCard("goog");
