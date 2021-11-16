const portfolioTable = document.getElementById("portfolio-table");
let html;
const stocks = new Map();

stocks.set("AAPL", {
  shares: 10,
  entry: 150,
  //   paid: parseInt(this.shares) * parseInt(this.entry),
  paid: 10 * 150,
});

stocks.set("NVDA", {
  shares: 12,
  entry: 133.09,
  //   paid: parseInt(this.shares) * parseInt(this.entry),
  paid: 12 * 133.09,
});

stocks.set("GGPI", {
  shares: 62,
  entry: 10.91,
  //   paid: parseInt(this.shares) * parseInt(this.entry),
  paid: 62 * 10.91,
});

console.log(stocks);
console.log(stocks.get("AAPL"));
console.log(stocks.get("AAPL").entry);
console.log(typeof stocks.get("AAPL").paid);
console.log(stocks.get("AAPL").paid);

fetch(
  `https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    html = `
      <tr>
      <td>AAPL</td>
      <td>${stocks.get("AAPL").shares}</td>
      <td>${stocks.get("AAPL").entry}</td>
      <td>${data.latestPrice}</td>
      <td>${stocks.get("AAPL").paid}</td>
      <td>${stocks.get("AAPL").shares * data.latestPrice}</td>
      <td>${(data.changePercent * 100).toFixed(2)}%</td>
      <td>${(stocks.get("AAPL").shares * data.change).toFixed(2)}</td>
      <td>${(
        stocks.get("AAPL").shares * data.latestPrice -
        stocks.get("AAPL").paid
      ).toFixed(2)}</td>
      <td>${(
        ((data.latestPrice - stocks.get("AAPL").entry) /
          stocks.get("AAPL").entry) *
        100
      ).toFixed(2)}%</td>
    </tr>
    `;
    portfolioTable.insertAdjacentHTML("beforeend", html);
  });

fetch(
  `https://cloud.iexapis.com/stable/stock/NVDA/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    html = `
        <tr>
        <td>NVDA</td>
        <td>${stocks.get("NVDA").shares}</td>
        <td>${stocks.get("NVDA").entry}</td>
        <td>${data.latestPrice}</td>
        <td>${stocks.get("NVDA").paid}</td>
        <td>${(stocks.get("NVDA").shares * data.latestPrice).toFixed(2)}</td>
        <td>${(data.changePercent * 100).toFixed(2)}%</td>
        <td>${(stocks.get("NVDA").shares * data.change).toFixed(2)}</td>
        <td>${(
          stocks.get("NVDA").shares * data.latestPrice -
          stocks.get("NVDA").paid
        ).toFixed(2)}</td>
        <td>${(
          ((data.latestPrice - stocks.get("NVDA").entry) /
            stocks.get("NVDA").entry) *
          100
        ).toFixed(2)}%</td>
      </tr>
      `;
    portfolioTable.insertAdjacentHTML("beforeend", html);
  });

fetch(
  `https://cloud.iexapis.com/stable/stock/GGPI/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    html = `
          <tr>
          <td>GGPI</td>
          <td>${stocks.get("GGPI").shares}</td>
          <td>${stocks.get("GGPI").entry}</td>
          <td>${data.latestPrice}</td>
          <td>${stocks.get("GGPI").paid}</td>
          <td>${(stocks.get("GGPI").shares * data.latestPrice).toFixed(2)}</td>
          <td>${(data.changePercent * 100).toFixed(2)}%</td>
          <td>${(stocks.get("GGPI").shares * data.change).toFixed(2)}</td>
          <td>${(
            stocks.get("GGPI").shares * data.latestPrice -
            stocks.get("GGPI").paid
          ).toFixed(2)}</td>
          <td>${(
            ((data.latestPrice - stocks.get("GGPI").entry) /
              stocks.get("GGPI").entry) *
            100
          ).toFixed(2)}%</td>
        </tr>
        `;
    portfolioTable.insertAdjacentHTML("beforeend", html);
  });
