import currentPortfolio from "./currentPortfolio.js";
import currentStockCards from "./currentStockCards.js";

export default class BrowserLocalStorage {
  static getAllStocks() {
    const stockList = JSON.parse(
      localStorage.getItem("portfolio-stocks") || "[]"
    );
    return stockList;
  }

  static addStock(stockToAdd) {
    const stockList = BrowserLocalStorage.getAllStocks();
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
    const stockList = BrowserLocalStorage.getAllStocks();
    const existing = stockList.find((stock) => stock.ticker === ticker);

    if (existing) {
      existing.shares = shares;
      existing.entry = entry;
    }
    localStorage.setItem("portfolio-stocks", JSON.stringify(stockList));
  }

  static deleteStock(stockToDel) {
    const stockList = BrowserLocalStorage.getAllStocks();
    const newStockList = stockList.filter(
      (stock) => stock.ticker != stockToDel
    );

    localStorage.setItem("portfolio-stocks", JSON.stringify(newStockList));
  }

  static sortStock(stockProperty, asc = true) {
    let stockList = BrowserLocalStorage.getAllStocks();
    const dirModifier = asc ? 1 : -1;

    stockList.sort((a, b) => {
      return a[stockProperty] < b[stockProperty]
        ? dirModifier * 1
        : dirModifier * -1;
    });

    localStorage.setItem("portfolio-stocks", JSON.stringify(stockList));
  }

  static getAllStockCards() {
    const stockCardList = JSON.parse(
      localStorage.getItem("stock-cards") || "[]"
    );
    return stockCardList;
  }

  static addStockCard(stockToAdd) {
    const stockCardList = BrowserLocalStorage.getAllStockCards();
    const existing = stockCardList.find((stock) => stock.ticker === stockToAdd);

    if (existing) {
      console.log(`${stockToAdd} already exist`);
    } else {
      stockCardList.push(stockToAdd);
    }
    localStorage.setItem("stock-cards", JSON.stringify(stockCardList));
  }

  static deleteStockCard(stockToDel) {
    const stockCardList = BrowserLocalStorage.getAllStockCards();
    const newStockList = stockCardList.filter(
      (stock) => stock.ticker != stockToDel
    );

    localStorage.setItem("stock-cards", JSON.stringify(newStockList));
  }
}
