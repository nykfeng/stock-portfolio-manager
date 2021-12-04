const stocks = [];

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

// const calculateStockReturn = function () {
//   stocks.forEach((stock) => {
//     stock.totalPaid = stock.shares * stock.entry;
//     stock.marketValue = stock.shares * stock.latestPrice;
//     stock.overallGain = stock.shares * stock.latestPrice - stock.totalPaid;
//     stock.overallGainPercent =
//       ((stock.latestPrice - stock.entry) / stock.entry) * 100;
//   });
// };

export default {
  stocks,
  currentStockNameList,
  add,
  del,
  storingAPIData,
};
