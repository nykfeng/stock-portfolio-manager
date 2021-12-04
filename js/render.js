import currentPortfolioStocks from "./currentPortfolioStocks.js";
import utility from "./utility.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";

const portfolioTableEl = document.getElementById("portfolio-table");
const stockCardSection = document.getElementById("stock-card-section");
const stockCardAdditionEl = document.querySelector(".stock-card-adding");

const portfolio = function () {
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  // Rendering from local array memory, which has been updated by pulling Local Storage first

  currentPortfolioStocks.stocks.forEach(async (stock) => {
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

const reArrangePortfolioBySort = function () {
  const portfolioBodyEl = document.querySelector("#portfolio-table tbody");
  console.log(portfolioBodyEl);
  while (portfolioBodyEl.firstChild) {
    portfolioBodyEl.removeChild(portfolioBodyEl.firstChild);
  }
  currentPortfolioStocks.stocks.forEach((stock) => {
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
    <button class="close-stock-card">X</button>
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

export default {
  reArrangePortfolioBySort,
  portfolio,
  portfolioRowHtml,
  stockCard,
  getCompanyLogoFromAPI,
};
