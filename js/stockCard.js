const stockCardSection = document.getElementById("stock-card-section");

export default async function (ticker, logo) {
  const res = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
  );
  const data = await res.json();
  console.log(data);
  renderStockCard(data, logo);
}

const renderStockCard = function (stock, logo) {
  let html = `
    <div class="stock-card">
    <div class="stock-basics">
      <span class="stock-company-name">${stock.companyName}</span>
      <span class="stock-logo" data-logo><img class="stock-logo-img" src="${logo}"></span></span>
      <div class="stock-last-price">
      <span>${stock.primaryExchange}: ${stock.symbol}</span>
      <span>Latest Price: <span class="highlight">${
        stock.latestPrice
      }</span></span>
      <span>Latest Change: <span class="highlight">${(
        parseFloat(stock.changePercent) * 100
      ).toFixed(2)}%</span></span>
      </div>
    </div>
    <div class="stock-chart">
  
    </div>
    <div class="stock-info">
      <span class="stock-info-piece">YTD: ${(
        parseFloat(stock.ytdChange) * 100
      ).toFixed(2)}%</span>
      <span class="stock-info-piece">Market Cap: ${(
        parseInt(stock.marketCap) / 1000000000
      ).toFixed(2)} Billion</span>
      <span class="stock-info-piece">PE Ratio: ${stock.peRatio}</span>
      <span class="stock-info-piece">52WK Low/High: ${stock.week52Low}/${
    stock.week52High
  }</span>
    </div>
  </div>
      `;
  stockCardSection.insertAdjacentHTML("beforeend", html);
};
