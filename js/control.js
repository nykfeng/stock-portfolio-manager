import PortfolioLocalStorage from "./PortfolioLocalStorage.js";
import currentPortfolioStocks from "./currentPortfolioStocks.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";
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
const addStockFromInput = async function () {
  const stockTicker = stockTickerInputEl.value.toUpperCase();
  const stockEntry = stockEntryPriceInputEl.value;
  const stockQuantity = stockSharesInputEl.value.replace(/[,]+/g, "");

  stockTickerInputEl.value = "";
  stockEntryPriceInputEl.value = "";
  stockSharesInputEl.value = "";

  if (!stockTicker || !stockEntry || !stockQuantity) {
    return;
  }

  if (
    !parseFloat(stockEntry) ||
    !parseFloat(stockQuantity) ||
    parseFloat(stockEntry) <= 0 ||
    parseFloat(stockQuantity) <= 0
  ) {
    fetchStockFromAPI.fetchStockInfoError();
    return;
  }

  if (await fetchStockFromAPI.fetchStockInfo({ ticker: stockTicker })) {
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
  }
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

const initializeWithSampleData = function () {
  fetch("./sample.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("portfolio-stocks", JSON.stringify(data));
    });
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
    dialog.confirmDeletion();

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

  // Since individual delete buttons are rendered dynamically,
  // the event listener will first listen to the portfolio-table ID
  // then when the exact delete button element was click, it executes the delete
  const individualStockBtn = document.querySelector("#portfolio-table");
  individualStockBtn.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("far") &&
      e.target.parentElement.classList.contains("delete-btn")
    ) {
      const ticker =
        e.target.parentElement.parentElement.querySelector(
          ".ticker"
        ).textContent;
      deleteIndividualStockFromPortfolio(ticker);
      console.log(ticker + " was deleted!");
      removePortfolioHtml();
      render.portfolio();
    }

    if (
      e.target.classList.contains("far") &&
      e.target.parentElement.classList.contains("edit-btn")
    ) {
      const ticker =
        e.target.parentElement.parentElement.querySelector(
          ".ticker"
        ).textContent;
      console.log(ticker + " was edited");
      const tableCellEls =
        e.target.parentElement.parentElement.querySelectorAll(
          ".ticker, .shares, .entry-price"
        );
      console.log(tableCellEls);
      editTableCell(tableCellEls);
      tableCellEls.removeEventListeners;
    }
  });
};

/* --------------------- END of Button Control  ---------------------------*/

const editTableCell = function (tableCells) {
  tableCells.forEach((tabelCell) => {
    tabelCell.addEventListener("click", function () {
      if (this.hasAttribute("data-clicked")) return;

      this.setAttribute("data-clicked", "yes");
      this.setAttribute("data-text", this.innerHTML);

      const input = document.createElement("input");
      input.classList.add("tableCellInput");
      input.setAttribute("type", "text");

      console.log(this.classList);
      console.log(this.getBoundingClientRect().width);
      input.value = this.textContent;
      console.log("offsetWidth");
      console.log(this.offsetWidth);
      console.log("clientLeft");
      console.log(this.clientLeft);
      input.style.width = "100%";
      // input.style.width = this.offsetWidth * 0.8 + "px";
      console.log(input.width);
      input.style.height = this.offsetHeight + -this.clientTop * 2 + "px";
      console.log("offetHeight");
      console.log(this.offsetHeight);
      input.style.display = "inline-block";
      input.style.fontFamily = "inherit";
      input.style.fontSize = "inherit";
      input.style.textAlign = "inherit";
      input.style.color = "#FFF";
      input.style.backgroundColor = "gray";

      input.addEventListener("blur", function () {
        const tdEl = input.parentElement;
        const originalText = input.parentElement.getAttribute("data-text");
        const currentText = this.value;

        if (originalText != currentText) {
          console.log(originalText + " became " + currentText);
          tdEl.removeAttribute("data-clicked");
          tdEl.removeAttribute("data-text");
          tdEl.innerHTML = currentText;
          tdEl.style.cssText = "padding: 1px;";
        } else {
          tdEl.removeAttribute("data-clicked");
          tdEl.removeAttribute("data-text");
          tdEl.innerHTML = originalText;
          tdEl.style.cssText = "padding: 1px;";
          console.log("No Changes");
        }
      });
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") this.blur();
      });

      this.innerHTML = "";
      this.style.cssText = "padding: 0px 0px";
      this.append(input);
      this.firstElementChild.select();
    });
  });
};

export default {
  removePortfolioHtml,
  addStockFromInput,
  deletePortfolio,
  deleteIndividualStockFromPortfolio,
  initializeWithSampleData,
  buttonsON,
};
