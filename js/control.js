import PortfolioLocalStorage from "./PortfolioLocalStorage.js";
import currentPortfolioStocks from "./currentPortfolioStocks.js";
import render from "./render.js";
import utility from "./utility.js";
import dialog from "./dialog.js";

// Input fields
const stockTickerInputEl = document.getElementById("stock-ticker");
const stockEntryPriceInputEl = document.getElementById("entry-price");
const stockSharesInputEl = document.getElementById("number-shares");

// Portfolio Control Buttons
const tableHeaderEls = document.querySelectorAll(".th-sort-header");
const addStockBtn = document.getElementById("submit-stock");
const deletePortfolioBtn = document.getElementById("delete-all-stock");
const editPortfolioBtn = document.getElementById("edit-all-stock");

// Hidden button column headers
const hiddenTableHeaderEls = document.querySelectorAll(".th-place-holder");

stockSharesInputEl.addEventListener("keyup", function () {
  this.value = utility.formatNumber(this.value.replace(/[,]+/g, ""));
});

stockTickerInputEl.addEventListener("keyup", function () {
  this.value = this.value.toUpperCase();
});

// Main add button
const addStockFromInput = function () {
  const stockTicker = stockTickerInputEl.value.toUpperCase();
  const stockEntry = stockEntryPriceInputEl.value;
  const stockQuantity = stockSharesInputEl.value.replace(/[,]+/g, "");

  stockTickerInputEl.value = "";
  stockEntryPriceInputEl.value = "";
  stockSharesInputEl.value = "";

  if (!stockTicker || !stockEntry || !stockQuantity) {
    return;
  }
  //  else
  PortfolioLocalStorage.addStock({
    ticker: stockTicker,
    shares: +stockQuantity,
    entry: +stockEntry,
    acquiredDate: new Date().toISOString(),
  });
  currentPortfolioStocks.add({
    ticker: stockTicker,
    shares: +stockQuantity,
    entry: +stockEntry,
    acquiredDate: new Date().toISOString(),
  });
  removePortfolioHtml();
  render.portfolio();
};

// Remove the whole portfolio
const deletePortfolio = function () {
  localStorage.clear();
  currentPortfolioStocks.stocks.splice(0, currentPortfolioStocks.stocks.length);
  // const stockInfoRow = document.querySelectorAll(".stock-info-row");

  // for (const el of stockInfoRow) {
  //   el.remove();
  // }

  // ------------  OR  -------------------
  removePortfolioHtml();
};

const removePortfolioHtml = function () {
  const stockPortfolioBody = document.querySelector("#portfolio-table tbody");
  if (stockPortfolioBody) stockPortfolioBody.remove();
};

const deleteIndividualStockFromPortfolio = function (ticker) {
  currentPortfolioStocks.del(ticker);
  PortfolioLocalStorage.deleteStock(ticker);
};

/* -------------------- START of Button Control  ---------------------------*/

const buttonsON = function () {
  tableHeaderEls.forEach(function (tableHeader) {
    tableHeader.addEventListener("click", function () {
      const asc = this.classList.contains("th-sort-asc");
      resetSortButtons();
      this.classList.remove("th-sort-pending");

      sortingPortfolioColumns(tableHeader.dataset.column, asc);

      this.classList.toggle("th-sort-asc", !asc);
      this.classList.toggle("th-sort-desc", asc);
      console.log(currentPortfolioStocks.stocks);

      render.reArrangePortfolioBySort();
    });
  });

  const resetSortButtons = function () {
    tableHeaderEls.forEach(function (tableHeader) {
      tableHeader.classList.add("th-sort-pending");
    });
  };

  const sortingPortfolioColumns = function (column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    currentPortfolioStocks.stocks.sort((a, b) => {
      return a[column] < b[column] ? dirModifier * 1 : dirModifier * -1;
    });
  };

  // Add stocks to portfolio
  addStockBtn.addEventListener("click", addStockFromInput);

  // Clear the portfolio
  deletePortfolioBtn.addEventListener("click", function () {
    // If there are no stocks to remove, simply return
    if (currentPortfolioStocks.stocks.length === 0) return;
    dialog();

    document
      .querySelector(".confirm_button--ok")
      .addEventListener("click", function () {
        deletePortfolio();
        document.querySelector(".confirm_dialog-background").remove();
      });

    document
      .querySelector(".confirm_button--cancel")
      .addEventListener("click", function () {
        document.querySelector(".confirm_dialog-background").remove();
      });
  });

  // Edit portfolio button
  editPortfolioBtn.addEventListener("click", function () {
    document.querySelectorAll(".th-place-holder").forEach((tableHead) => {
      tableHead.classList.toggle("hide-it");
    });
    document.querySelectorAll(".indivial-row-btns").forEach((eachRow) => {
      eachRow.classList.toggle("hide-it");
    });
  });

  console.log(document.querySelector("#portfolio-table tbody"));
  const deleteIndividualStockBtn = document.querySelectorAll(".delete-btn");
  const EditIndividualStockBtn = document.querySelectorAll(".edit-btn");

  // Delete individual stock button // NEED Fixing
  deleteIndividualStockBtn.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      console.log("Pre deleting");
      console.log(currentPortfolioStocks.stocks);
      const ticker = this.parentElement.querySelector(".ticker").textContent;
      deleteIndividualStockFromPortfolio(ticker);
      removePortfolioHtml();
      render.portfolio();
      console.log("Post deleting");
      console.log(currentPortfolioStocks.stocks);
    });
  });
};

// Edit individual stock button
// console.log(EditIndividualStockBtn);
// EditIndividualStockBtn.forEach((editBtn) => {
//   editBtn.addEventListener("click", function () {
//     console.log("clicked");
//   });
// });

/* --------------------- END of Button Control  ---------------------------*/

export default {
  removePortfolioHtml,
  addStockFromInput,
  deletePortfolio,
  deleteIndividualStockFromPortfolio,
  buttonsON,
};
