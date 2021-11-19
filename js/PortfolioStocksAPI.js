export default class PortfolioStocksAPI {
  static getAllStocks() {
    const stockList = JSON.parse(
      localStorage.getItem("portfolio-stocks") || "[]"
    );
    return stockList;
  }

  static addStock(stockToAdd) {
    const stockList = PortfolioStocksAPI.getAllStocks();
    const existing = stockList.find(
      (stock) => stock.ticker == stockToAdd.ticker
    );
    console.log(existing);

    if (existing) {
      const totalNewShares = existing.shares + stockToAdd.shares;
      console.log(`total new shares ${totalNewShares}`);
      // To find the new cost average
      const totalNewPaid =
        existing.shares * existing.entry + stockToAdd.shares * stockToAdd.entry;
      console.log(`total new paid ${totalNewPaid}`);
      const newEntry = totalNewPaid / totalNewShares;
      existing.shares = totalNewShares;
      existing.entry = newEntry;
    } else {
      stockList.push(stockToAdd);
    }
    localStorage.setItem("portfolio-stocks", JSON.stringify(stockList));
  }

  static deleteStock(stockToDel) {
    const stockList = PortfolioStocksAPI.getAllStocks();
    const newStockList = stockList.filter(
      (stock) => stock.ticker != stockToDel
    );

    localStorage.setItem("portfolio-stocks", JSON.stringify(newStockList));
  }
}
