const stocks = [];

const currentStockNameList = function () {
  return stocks.map((stock) => stock.ticker);
};

const add = function (stockToAdd) {
  const existing = stocks.find((stock) => stock.ticker == stockToAdd.ticker);
  if (existing) {
    console.log("ALready exist in currentStockCard");
  } else {
    stocks.push(stockToAdd);
  }
};

const del = function (stockToDelete) {
  const index = stocks.findIndex((stock) => stock.ticker === stockToDelete);
  stocks.splice(index, 1);
};

export default {
  stocks,
  currentStockNameList,
  add,
  del,
};
