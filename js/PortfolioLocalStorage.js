export default class PortfolioLocalStorage {
  static getAllStocks() {
    const stockList = JSON.parse(
      localStorage.getItem("portfolio-stocks") || "[]"
    );
    return stockList;
  }

  static addStock(stockToAdd) {
    const stockList = PortfolioLocalStorage.getAllStocks();
    const existing = stockList.find(
      (stock) => stock.ticker === stockToAdd.ticker
    );

    if (existing) {
      const totalNewShares = existing.shares + stockToAdd.shares;
      // To find the new cost average
      const totalNewPaid =
        existing.shares * existing.entry + stockToAdd.shares * stockToAdd.entry;
      const newEntry = totalNewPaid / totalNewShares;
      existing.shares = totalNewShares;
      existing.entry = newEntry;
    } else {
      stockList.push(stockToAdd);
    }
    localStorage.setItem("portfolio-stocks", JSON.stringify(stockList));
  }

  static editStock(ticker, shares, entry) {
    const stockList = PortfolioLocalStorage.getAllStocks();
    const existing = stockList.find((stock) => stock.ticker === ticker);

    console.log("existing is ");
    console.log(existing);

    if (existing) {
      existing.shares = shares;
      existing.entry = entry;
    }
    localStorage.setItem("portfolio-stocks", JSON.stringify(stockList));
  }

  static deleteStock(stockToDel) {
    const stockList = PortfolioLocalStorage.getAllStocks();
    const newStockList = stockList.filter(
      (stock) => stock.ticker != stockToDel
    );

    localStorage.setItem("portfolio-stocks", JSON.stringify(newStockList));
  }
}
