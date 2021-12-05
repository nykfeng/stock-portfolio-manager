google.charts.load("current", { packages: ["corechart", "line"] });

const chartArray = [["Time", "Price"]];

function drawChart(ticker, data) {
  chartArray.push(...data);
  var data = google.visualization.arrayToDataTable(chartArray);

  var options = {
    curveType: "function",
    legend: "none",
    width: 256,
    height: 130,
    backgroundColor: "#d6d6d6",
  };

  var chart = new google.visualization.LineChart(
    document.getElementById(`Google-chart--${ticker}`)
  );

  chart.draw(data, options);
  chartArray.splice(1);
}

export default {
  drawChart,
};
