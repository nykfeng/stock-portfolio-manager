import PortfolioStocksAPI from "./js/PortfolioStocksAPI.js";
import stockCard from "./js/stockCard.js";
import logoImg from "./js/logoImg.js";

const portfolioTable = document.getElementById("portfolio-table");
const addStockBtn = document.getElementById("submit-stock");
const clearPortfolioBtn = document.getElementById("delete-all-stock");

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
  const stockQuantity = document.getElementById("number-shares").value;

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

// stocks.push({
//   ticker: "AAPL",
//   shares: 10,
//   entry: 150,
//   paid: function () {
//     return this.shares * this.entry;
//   },
//   acquiredDate: new Date(),
// });

// stocks.push({
//   ticker: "NVDA",
//   shares: 15,
//   entry: 120,
//   paid: function () {
//     return this.shares * this.entry;
//   },
//   acquiredDate: new Date(),
// });

// stocks.push({
//   ticker: "U",
//   shares: 20,
//   entry: 90,
//   paid: function () {
//     return this.shares * this.entry;
//   },
//   acquiredDate: new Date(),
// });

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
  return `
  <tr class="stock-info-row ticker-${stock.ticker}">
      <td id="ticker">${stock.ticker}</td>
      <td id="shares">${stock.shares}</td>
      <td id="entry-price">$${stock.entry.toFixed(2)}</td> 
      <td id="latest-price">$${stockAPIData.latestPrice.toFixed(2)}</td> 
      <td id="total-paid">$${totalPaid.toFixed(2)}</td> 
      <td id="latest-value">$${(
        stock.shares * stockAPIData.latestPrice
      ).toFixed(2)}</td> 
      <td id="daily-percentage">${(stockAPIData.changePercent * 100).toFixed(
        2
      )}%</td> 
      <td id="daily-change">$${(stock.shares * stockAPIData.change).toFixed(
        2
      )}</td> 
      <td id="total-profit-loss">$${(
        stock.shares * stockAPIData.latestPrice -
        totalPaid
      ).toFixed(2)}</td>
      <td id="total-roi">${(
        ((stockAPIData.latestPrice - stock.entry) / stock.entry) *
        100
      ).toFixed(2)}%</td>
    </tr>
  `;
};

const renderPortfolio = function () {
  PortfolioStocksAPI.getAllStocks().forEach(async (stock) => {
    html = await renderStockInfo(stock);
    portfolioTable.insertAdjacentHTML("beforeend", html);
  });
};

renderPortfolio();
stockCard("fb", logoImg.facebookLogo);
stockCard("nvda", logoImg.nvidiaLogo);
stockCard("amzn", logoImg.amazonLogo);
