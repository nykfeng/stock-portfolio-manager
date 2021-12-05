const stocks = [];
const overview = [];

const currentStockNameList = function () {
  return stocks.map((stock) => stock.ticker);
};

const add = function (stockToAdd) {
  const existing = stocks.find((stock) => stock.ticker == stockToAdd.ticker);
  if (existing) {
    const totalNewShares = existing.shares + stockToAdd.shares;
    // To find the new cost average
    const totalNewPaid =
      existing.shares * existing.entry + stockToAdd.shares * stockToAdd.entry;
    const newEntry = totalNewPaid / totalNewShares;
    existing.shares = totalNewShares;
    existing.entry = newEntry;
  } else {
    stocks.push(stockToAdd);
  }
};

const del = function (stockToDelete) {
  const index = stocks.findIndex((stock) => stock.ticker === stockToDelete);
  stocks.splice(index, 1);
};

const storingAPIData = function (APIData) {
  const index = stocks.findIndex((stock) => stock.ticker === APIData.symbol);
  if (index > -1) {
    stocks[index].change = APIData.change * stocks[index].shares;
    stocks[index].changePercent = APIData.changePercent;
    stocks[index].latestPrice = APIData.latestPrice;
  }
};

const calculatingPortfolio = async function () {
  let dailyChange = 0;

  stocks.forEach((stock) => {
    dailyChange += parseFloat(stock.change);
    console.log("stock ticker is " + stock.ticker);
    console.log("stock change is " + stock.change);
    console.log("dailyChange is " + dailyChange);
  });
  console.log(dailyChange);
};

const initializeOverview = function () {
  overview.dailyChange = 0;
  overview.dailyChangePercent = 0;
  overview.portfolioChange = 0;
  overview.portfolioChangePercent = 0;
  overview.portfolioValue = 0;
};

export default {
  stocks,
  overview,
  currentStockNameList,
  add,
  del,
  storingAPIData,
  calculatingPortfolio,
  initializeOverview,
};
