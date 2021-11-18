export default class PortfolioStocksAPI {
  static getAllStocks() {
    const stockList = JSON.parse(
      localStorage.getItem("portfolio-stocks") || "[]"
    );
    return stockList;
  }

  static addStock(stockToAdd) {
    const stockList = PortfolioStocksAPI.getAllStocks();
    stockList.push(stockToAdd);

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
