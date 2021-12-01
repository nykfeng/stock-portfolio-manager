const fetchStockInfo = async function (stock) {
  try {
    const res = await fetch(
      `https://cloud.iexapis.com/stable/stock/${stock.ticker}/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.name);
    fetchStockInfoError(err.name);
  }
};

const fetchStockInfoError = function (error) {
  // Dialog box to tell the error.
  // Generate dialog box with the error name
};

export default {
  fetchStockInfo,
  fetchStockInfoError,
};
