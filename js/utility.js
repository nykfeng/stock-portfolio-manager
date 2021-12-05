function formatNumber(number) {
  //   console.log(`number is ${number}`);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function cleanNumberFormat(numberString) {
  return numberString.substring(1, numberString.length).replace(/[,]+/g, "");
}

const calculateMarketCapUnit = function (marketCap) {
  const markCap =
    parseInt(marketCap) >= 1000000000000
      ? (parseInt(marketCap) / 1000000000000).toFixed(2) + " Trillion"
      : parseInt(marketCap) >= 1000000000
      ? (parseInt(marketCap) / 1000000000).toFixed(2) + " Billion"
      : (parseInt(marketCap) / 1000000).toFixed(2) + " Million";
  return markCap;
};

const formatStockCardCompanyName = function (name) {
  if (name.includes(" -")) return name.substring(0, name.indexOf("-"));
  return name;
};

const formatStockExchangeName = function (name) {
  if (name.toUpperCase().includes("NEW YORK STOCK EXCHANGE")) return "NYSE";
  else return name;
};

const formatPortfolioColor = function (plusMinus) {
  return plusMinus >= 0 ? "green-price-box" : "red-price-box";
};

const removeColorBox = function (boxElement) {
  boxElement.classList.remove("red-price-box");
  boxElement.classList.remove("green-price-box");
};

export default {
  formatNumber,
  cleanNumberFormat,
  formatStockCardCompanyName,
  calculateMarketCapUnit,
  formatPortfolioColor,
  formatStockExchangeName,
  removeColorBox,
};
