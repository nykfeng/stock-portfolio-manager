import currentPortfolio from "./currentPortfolio.js";
import utility from "./utility.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";
import googleChart from "./googleChart.js";

const portfolioTableEl = document.getElementById("portfolio-table");
const stockCardSection = document.getElementById("stock-card-section");
const stockCardAdditionEl = document.querySelector(".stock-card-adding");

const portfolio = function () {
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  currentPortfolio.initializeOverview();

  // Rendering from local array memory, which has been updated by pulling Local Storage first

  currentPortfolio.stocks.forEach(async (stock) => {
    const APIData = await fetchStockFromAPI.fetchStockInfo(stock);
    if (!APIData) return;
    stock.change = APIData.change * stock.shares;
    stock.changePercent = APIData.changePercent;
    stock.latestPrice = APIData.latestPrice;
    stock.totalPaid = stock.shares * stock.entry;
    stock.marketValue = stock.shares * stock.latestPrice;
    stock.overallGain = stock.shares * stock.latestPrice - stock.totalPaid;
    stock.overallGainPercent =
      ((stock.latestPrice - stock.entry) / stock.entry) * 100;

    const html = portfolioRowHtml(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);

    currentPortfolio.overview.dailyChange += stock.change;
    currentPortfolio.overview.portfolioValue += stock.marketValue;
    currentPortfolio.overview.portfolioChange += stock.overallGain;
  });
};

const portfolioNew = function () {
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  currentPortfolio.stocks.forEach(async (stock) => {
    const html = portfolioRowFixeValueHtml(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
    await portfolioRowDynamicValueHtml(stock);
  });
};

const portfolioRowHtml = function (stock) {
  return `
    <tr class="stock-info-row ticker-${stock.ticker}">
        <td class="indivial-row-btns edit-btn ${
          document
            .querySelector(".th-place-holder")
            .classList.contains("hide-it")
            ? "hide-it"
            : ""
        }"><i class="far fa-edit"></i></td>
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
        <td class="daily-percentage ${utility.formatPortfolioColor(
          stock.changePercent
        )}">${utility.formatNumber(
    (stock.changePercent * 100).toFixed(2)
  )}%</td> 
        <td class="daily-change ${utility.formatPortfolioColor(
          stock.changePercent
        )}">$${utility.formatNumber(stock.change.toFixed(2))}</td> 
        <td class="overall-gain">$${utility.formatNumber(
          stock.overallGain.toFixed(2)
        )}</td>
        <td class="overall-gain-percent ${utility.formatPortfolioColor(
          stock.overallGainPercent
        )}">${utility.formatNumber(stock.overallGainPercent.toFixed(2))}%</td>
        
        <td class="indivial-row-btns delete-btn ${
          document
            .querySelector(".th-place-holder")
            .classList.contains("hide-it")
            ? "hide-it"
            : ""
        }"><i class="far fa-trash-alt"></i></td>
      </tr>
  
    `;
};

const indexCharts = function () {
  const index = ["SPY", "QQQ", "IWM"];

  index.forEach(async (index) => {
    const intradayPriceData = await fetchStockFromAPI.chart(index);
    const chartData = [];

    // if (!intradayPriceData) return;
    for (let i = 0; i < intradayPriceData.length; i++) {
      // console.log(
      //   index +
      //     ": " +
      //     intradayPriceData[i].minute +
      //     ": " +
      //     intradayPriceData[i].close
      // );
      chartData.push([intradayPriceData[i].minute, intradayPriceData[i].close]);
    }

    googleChart.drawChart(index, chartData);
  });
};

const portfolioOverview = function () {
  const dailyChange = document.querySelector(".daily-change");
  const dailyChangePercent = document.querySelector(".daily-changePercent");
  const portfolioChange = document.querySelector(".portfolio-change");
  const portfolioChangePercent = document.querySelector(
    ".portfolio-changePercent"
  );
  const portfolioValue = document.querySelector(".portfolio-value");
};

const reArrangePortfolioBySort = function () {
  const portfolioBodyEl = document.querySelector("#portfolio-table tbody");
  while (portfolioBodyEl.firstChild) {
    portfolioBodyEl.removeChild(portfolioBodyEl.firstChild);
  }
  currentPortfolio.stocks.forEach((stock) => {
    const html = portfolioRowHtml(stock);
    portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  });
};

const stockCard = async function (ticker) {
  const stockAPIData = await fetchStockFromAPI.fetchStockInfo({
    ticker: ticker,
  });
  const html = await stockCardHtml(stockAPIData);

  stockCardAdditionEl.insertAdjacentHTML("beforebegin", html);
};

const stockCardHtml = async function (stock) {
  const logoSrc =
    (await getCompanyLogoFromAPI(stock)) || "./images/generic-company-pic.png";
  const html = `
  <div class="stock-card" data-${stock.symbol}>
  
  <div class="stock-basics">
    <div class="stock-card-title">
    <span class="stock-company-name">${utility.formatStockCardCompanyName(
      stock.companyName
    )}</span>
    <button class="close-stock-card"><i class="fas fa-times"></i></button>
    </div>
    <span class="stock-logo" data-logo><img class="stock-logo-img" src="${
      logoSrc.url
    }"></span>
    <div class="stock-last-price">
    <span>${utility.formatStockExchangeName(stock.primaryExchange)}: ${
    stock.symbol
  }</span>
    <div class="price-hightlight">
    
    <span>Latest Price: </span>
    <span class="highlight ${
      stock.changePercent >= 0 ? "green-price-box" : "red-price-box"
    }">${stock.latestPrice}
    </span>
    <span>Latest Change: </span>
    <span class="highlight ${
      stock.changePercent >= 0 ? "green-price-box" : "red-price-box"
    }">${(parseFloat(stock.changePercent) * 100).toFixed(2)}%
    </span>
    </div>
  </div>
</div>
  <div class="stock-chart">
  ${renderStockChartIframe(stock)}
  </div>
  <div class="stock-info">
    <span class="stock-info-piece">YTD: ${(
      parseFloat(stock.ytdChange) * 100
    ).toFixed(2)}%</span>
    <span class="stock-info-piece">Market Cap: ${utility.calculateMarketCapUnit(
      stock.marketCap
    )}</span>
    <span class="stock-info-piece">PE Ratio: ${stock.peRatio}</span>
    <span class="stock-info-piece">52WK Low/High: $${stock.week52Low} - $${
    stock.week52High
  }</span>
  </div>
</div>
      `;

  return html;
};

const renderStockChartIframe = function (stock) {
  const html = `
  <div id="tradingview_b9e96-wrapper"
    style="position: relative;box-sizing: content-box;width: 240px;height: 150px;margin: 0 auto !important;padding: 0 !important;font-family:Arial,sans-serif;">
    <div style="width: 240px;height: 150px;background: transparent;padding: 0 !important;"><iframe
        id="tradingview_b9e96"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b9e96&amp;symbol=${stock.symbol}&amp;interval=5&amp;hidetoptoolbar=1&amp;hidelegend=1&amp;saveimage=0&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;theme=dark&amp;style=2&amp;timezone=America%2FNew_York&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=127.0.0.1&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${stock.symbol}"
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;" frameborder="0"
        allowtransparency="true" scrolling="no" allowfullscreen=""></iframe></div>
  </div>
  `;
  return html;
};

const getCompanyLogoFromAPI = async function (stock) {
  const res = await fetch(
    `https://cloud.iexapis.com/stable/stock/${stock.symbol}/logo?token=pk_b8445edb92244ad88a3de425568b1d07`
  );
  const logoSrc = res.json();

  return logoSrc;
};

const portfolioRowFixeValueHtml = function (stock) {
  return `
  <tr class="stock-info-row ticker-${stock.ticker}">
        <td class="indivial-row-btns edit-btn ${
          document
            .querySelector(".th-place-holder")
            .classList.contains("hide-it")
            ? "hide-it"
            : ""
        }"><i class="far fa-edit"></i></td>
        <td class="ticker">${stock.ticker}</td>
        <td class="shares">${utility.formatNumber(stock.shares)}</td>
        <td class="entry-price">$${utility.formatNumber(
          stock.entry.toFixed(2)
        )}</td> 
        <td class="latest-price">Loading...</td> 
        <td class="total-paid">$${utility.formatNumber(
          (stock.entry * stock.shares).toFixed(2)
        )}</td> 
        <td class="latest-value">Loading...</td> 
        <td class="daily-percentage">Loading...</td> 
        <td class="daily-change">Loading...</td> 
        <td class="overall-gain">Loading...</td>
        <td class="overall-gain-percent">Loading...</td>
        <td class="indivial-row-btns delete-btn ${
          document
            .querySelector(".th-place-holder")
            .classList.contains("hide-it")
            ? "hide-it"
            : ""
        }"><i class="far fa-trash-alt"></i></td>
      </tr>
  `;
};

const portfolioRowDynamicValueHtml = async function (stock) {
  const APIData = await fetchStockFromAPI.fetchStockInfo(stock);
  if (!APIData) return;

  stock.change = APIData.change * stock.shares;
  stock.changePercent = APIData.changePercent;
  stock.latestPrice = APIData.latestPrice;
  stock.totalPaid = stock.shares * stock.entry;
  stock.marketValue = stock.shares * stock.latestPrice;
  stock.overallGain = stock.shares * stock.latestPrice - stock.totalPaid;
  stock.overallGainPercent =
    ((stock.latestPrice - stock.entry) / stock.entry) * 100;

  const currentRowEl = document.querySelector(`.ticker-${stock.ticker}`);

  currentRowEl.querySelector(
    `.latest-price`
  ).textContent = `$${utility.formatNumber(stock.latestPrice.toFixed(2))}`;

  currentRowEl.querySelector(
    `.latest-value`
  ).textContent = `$${utility.formatNumber(
    (stock.shares * stock.latestPrice).toFixed(2)
  )}`;

  const dailyChangePercentEL = currentRowEl.querySelector(`.daily-percentage`);
  dailyChangePercentEL.classList.add(
    `${utility.formatPortfolioColor(stock.changePercent)}`
  );
  dailyChangePercentEL.textContent = `${utility.formatNumber(
    (stock.changePercent * 100).toFixed(2)
  )}%`;

  const dailyChangeEL = currentRowEl.querySelector(`.daily-change`);
  dailyChangeEL.classList.add(
    `${utility.formatPortfolioColor(stock.changePercent)}`
  );
  dailyChangeEL.textContent = `$${utility.formatNumber(
    stock.change.toFixed(2)
  )}`;

  currentRowEl.querySelector(
    `.overall-gain`
  ).textContent = `$${utility.formatNumber(stock.overallGain.toFixed(2))}`;

  const overallGainPercentEl = currentRowEl.querySelector(
    `.overall-gain-percent`
  );
  overallGainPercentEl.classList.add(
    `${utility.formatPortfolioColor(stock.overallGainPercent)}`
  );
  overallGainPercentEl.textContent = `${utility.formatNumber(
    stock.overallGainPercent.toFixed(2)
  )}%`;
};

export default {
  reArrangePortfolioBySort,
  portfolio,
  portfolioRowHtml,
  stockCard,
  getCompanyLogoFromAPI,
  indexCharts,
  portfolioNew,
};
