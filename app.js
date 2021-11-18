import PortfolioStocksAPI from "./js/PortfolioStocksAPI.js";

const portfolioTable = document.getElementById("portfolio-table");
let html;
const stocks = [];

stocks.push({
  ticker: "AAPL",
  shares: 10,
  entry: 150,
  paid: function () {
    return this.shares * this.entry;
  },
  acquiredDate: new Date(),
});

stocks.push({
  ticker: "NVDA",
  shares: 15,
  entry: 120,
  paid: function () {
    return this.shares * this.entry;
  },
  acquiredDate: new Date(),
});

stocks.push({
  ticker: "U",
  shares: 20,
  entry: 90,
  paid: function () {
    return this.shares * this.entry;
  },
  acquiredDate: new Date(),
});

localStorage.clear();
stocks.forEach((stock) => PortfolioStocksAPI.addStock(stock));

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
  return `
  <tr>
      <td>${stock.ticker}</td>
      <td>${stock.shares}</td>
      <td>${stock.entry}</td>
      <td>${stockAPIData.latestPrice}</td>
      <td>${(stock.shares * stock.entry).toFixed(2)}</td>
      <td>${(stock.shares * stockAPIData.latestPrice).toFixed(2)}</td>
      <td>${(stockAPIData.changePercent * 100).toFixed(2)}%</td>
      <td>${(stock.shares * stockAPIData.change).toFixed(2)}</td>
      <td>${(stock.shares * stockAPIData.latestPrice - stock.paid()).toFixed(
        2
      )}</td>
      <td>${(
        ((stockAPIData.latestPrice - stock.entry) / stock.entry) *
        100
      ).toFixed(2)}%</td>
    </tr>
  `;
};

stocks.forEach(async (stock) => {
  console.log(stock);
  html = await renderStockInfo(stock);
  portfolioTable.insertAdjacentHTML("beforeend", html);
});
