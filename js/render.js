import currentPortfolio from "./currentPortfolio.js";
import utility from "./utility.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";
import googleChart from "./googleChart.js";

const portfolioTableEl = document.getElementById("portfolio-table");
const stockCardAdditionEl = document.querySelector(".stock-card-adding");

const portfolio = async function () {
  const portfolioBodyEl = document.createElement("tbody");
  portfolioTableEl.insertAdjacentElement("beforeend", portfolioBodyEl);

  // For calculating portfolio performance
  currentPortfolio.initializeOverview();

  // currentPortfolio.stocks.forEach(async (stock) => {
  //   const html = portfolioRowFixedValueHtml(stock);
  //   portfolioBodyEl.insertAdjacentHTML("beforeend", html);
  //   await portfolioRowDynamicValueHtml(stock);
  // });
  // portfolioOverview();

  await Promise.all(
    currentPortfolio.stocks.map(async (stock) => {
      const html = portfolioRowFixedValueHtml(stock);
      portfolioBodyEl.insertAdjacentHTML("beforeend", html);
      await portfolioRowDynamicValueHtml(stock);
    })
  ).then(() => {
    portfolioOverview();
    portfolioWeight();
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
        <td class="portfolio-weight">${stock.weight.toFixed(2)}%</td>
        
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

    for (let i = 0; i < intradayPriceData.length; i++) {
      chartData.push([intradayPriceData[i].minute, intradayPriceData[i].close]);
    }

    googleChart.drawChart(index, chartData);
  });
};

const portfolioOverview = function () {
  const dailyChange = document.querySelector(".portfolio-daily-change");
  const dailyChangePercent = document.querySelector(
    ".portfolio-daily-changePercent"
  );
  const portfolioChange = document.querySelector(".portfolio-change");
  const portfolioChangePercent = document.querySelector(
    ".portfolio-changePercent"
  );
  const portfolioValue = document.querySelector(".portfolio-value");

  // Need to calculate the overall daily change percentage
  currentPortfolio.overview.dailyChangePercent =
    currentPortfolio.overview.dailyChange /
      (currentPortfolio.overview.portfolioValue -
        currentPortfolio.overview.dailyChange) || 0;

  // Need to calculate the overall portfolio change percentage
  currentPortfolio.overview.portfolioChangePercent =
    currentPortfolio.overview.portfolioChange /
      currentPortfolio.overview.portfolioPaid || 0;

  //----- Updating HTML content with the numbers -------//
  dailyChange.textContent = utility.formatNumber(
    currentPortfolio.overview.dailyChange.toFixed(2)
  );
  dailyChangePercent.textContent = `${(
    currentPortfolio.overview.dailyChangePercent * 100
  ).toFixed(2)}%`;
  portfolioChange.textContent = utility.formatNumber(
    currentPortfolio.overview.portfolioChange.toFixed(2)
  );
  portfolioChangePercent.textContent = `${(
    currentPortfolio.overview.portfolioChangePercent * 100
  ).toFixed(2)}%`;
  portfolioValue.textContent = utility.formatNumber(
    currentPortfolio.overview.portfolioValue.toFixed(2)
  );

  // Remove previous color box class
  utility.removeColorBox(dailyChange);
  utility.removeColorBox(dailyChangePercent);
  utility.removeColorBox(portfolioChange);
  utility.removeColorBox(portfolioChangePercent);
  utility.removeColorBox(portfolioValue);

  //----- Adding red or green box to these numbers -------//
  dailyChange.classList.add(
    `${utility.formatPortfolioColor(currentPortfolio.overview.dailyChange)}`
  );
  dailyChangePercent.classList.add(
    `${utility.formatPortfolioColor(
      currentPortfolio.overview.dailyChangePercent
    )}`
  );
  portfolioChange.classList.add(
    `${utility.formatPortfolioColor(currentPortfolio.overview.portfolioChange)}`
  );
  portfolioChangePercent.classList.add(
    `${utility.formatPortfolioColor(
      currentPortfolio.overview.portfolioChangePercent
    )}`
  );
  portfolioValue.classList.add(
    `${utility.formatPortfolioColor(currentPortfolio.overview.portfolioValue)}`
  );
};

const reCalcPortfolioOverview = function () {
  currentPortfolio.initializeOverview();
  currentPortfolio.stocks.forEach((stock) => {
    currentPortfolio.overview.dailyChange += stock.change;
    currentPortfolio.overview.portfolioValue += stock.marketValue;
    currentPortfolio.overview.portfolioChange += stock.overallGain;
    currentPortfolio.overview.portfolioPaid += stock.totalPaid;
  });
};

const portfolioWeight = function () {
  const allweightEls = document.querySelectorAll(".portfolio-weight");
  allweightEls.forEach((weight) => {
    const currentRow = weight.parentElement;
    const currentValue = parseFloat(
      utility.cleanNumberFormat(
        currentRow.querySelector(".latest-value").textContent
      )
    );

    let currentWeight;
    if (currentPortfolio.overview.portfolioValue === 0) {
      currentWeight = 0;
    } else {
      currentWeight = (
        (currentValue / currentPortfolio.overview.portfolioValue) *
        100
      ).toFixed(2);
    }
    weight.textContent = currentWeight + "%";

    // also update the currentPortolio.stocks with the weight number
    const currentTicker = currentRow.querySelector(".ticker").textContent;

    currentPortfolio.stocks.forEach((stock) => {
      if (stock.ticker === currentTicker)
        stock.weight = parseFloat(currentWeight);
    });
  });
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
  <div class="stock-card" data-ticker="${stock.symbol}"">
  
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
    <span class="highlight ${utility.formatPortfolioColor(
      stock.changePercent
    )}">${stock.latestPrice}
    </span>
    <span>Latest Change: </span>
    <span class="highlight ${utility.formatPortfolioColor(
      stock.changePercent
    )}">${(parseFloat(stock.changePercent) * 100).toFixed(2)}%
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

const portfolioRowFixedValueHtml = function (stock) {
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
        <td class="portfolio-weight">Loading...</td>
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

  currentPortfolio.overview.dailyChange += stock.change;
  currentPortfolio.overview.portfolioValue += stock.marketValue;
  currentPortfolio.overview.portfolioChange += stock.overallGain;
  currentPortfolio.overview.portfolioPaid += stock.totalPaid;

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
  portfolioOverview,
  reCalcPortfolioOverview,
  portfolioWeight,
};
