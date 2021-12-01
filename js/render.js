import currentPortfolioStocks from "./currentPortfolioStocks.js";
import utility from "./utility.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";

const portfolioTableEl = document.getElementById("portfolio-table");

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
        <td class="daily-percentage ${formattPortfolioColor(
          stock.changePercent
        )}">${utility.formatNumber(
    (stock.changePercent * 100).toFixed(2)
  )}%</td> 
        <td class="daily-change ${formattPortfolioColor(
          stock.changePercent
        )}">$${utility.formatNumber(stock.change.toFixed(2))}</td> 
        <td class="overall-gain">$${utility.formatNumber(
          stock.overallGain.toFixed(2)
        )}</td>
        <td class="overall-gain-percent ${formattPortfolioColor(
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

//

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

const formattPortfolioColor = function (plusMinus) {
  return plusMinus >= 0 ? "green-price-box" : "red-price-box";
};

export default {
  reArrangePortfolioBySort,
  portfolio,
  portfolioRowHtml,
};
