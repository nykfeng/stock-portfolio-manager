import BrowserLocalStorage from "./BrowserLocalStorage.js";
import currentPortfolio from "./currentPortfolio.js";
import fetchStockFromAPI from "./fetchStockFromAPI.js";
import render from "./render.js";
import utility from "./utility.js";
import dialog from "./dialog.js";
import currentStockCards from "./currentStockCards.js";

// Input fields
const stockTickerInputEl = document.getElementById("stock-ticker");
const stockEntryPriceInputEl = document.getElementById("entry-price");
const stockSharesInputEl = document.getElementById("number-shares");

// Portfolio Control Buttons
const tableHeaderEls = document.querySelectorAll(".th-sort-header");
const addStockBtn = document.getElementById("submit-stock");
const deletePortfolioBtn = document.getElementById("delete-all-stock");
const editPortfolioBtn = document.getElementById("edit-all-stock");

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
    BrowserLocalStorage.addStock({
      ticker: stockTicker,
      shares: +stockQuantity,
      entry: +stockEntry,
      acquiredDate: new Date().toISOString(),
    });
    currentPortfolio.add({
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
  localStorage.removeItem("portfolio-stocks");
  currentPortfolio.stocks.splice(0, currentPortfolio.stocks.length);
  removePortfolioHtml();
};

const removePortfolioHtml = function () {
  const stockPortfolioBody = document.querySelector("#portfolio-table tbody");
  if (stockPortfolioBody) stockPortfolioBody.remove();
};

const deleteIndividualStockFromPortfolio = function (ticker) {
  currentPortfolio.del(ticker);
  BrowserLocalStorage.deleteStock(ticker);
};

const initializeSamplePortfolio = function () {
  fetch("./samplePortfolio.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("portfolio-stocks", JSON.stringify(data));
    });
};

const initializeSampleStockCards = function () {
  fetch("./sampleStockCard.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("stock-cards", JSON.stringify(data));
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
    currentPortfolio.stocks.sort((a, b) => {
      return a[column] < b[column] ? dirModifier * 1 : dirModifier * -1;
    });
  };

  // Add stocks to portfolio
  addStockBtn.addEventListener("click", addStockFromInput);

  // Clear the portfolio
  deletePortfolioBtn.addEventListener("click", function () {
    // If there are no stocks to remove, simply return
    if (currentPortfolio.stocks.length === 0) return;
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
      const currentRow = e.target.closest(".stock-info-row");
      const ticker = currentRow.querySelector(".ticker").textContent;
      deleteIndividualStockFromPortfolio(ticker);
      currentRow.remove();
    }

    if (
      e.target.classList.contains("far") &&
      e.target.parentElement.classList.contains("edit-btn")
    ) {
      const ticker =
        e.target.parentElement.parentElement.querySelector(
          ".ticker"
        ).textContent;
      const tableCellEls =
        e.target.parentElement.parentElement.querySelectorAll(
          ".ticker, .shares, .entry-price"
        );
      editTableCell(tableCellEls);
    }
  });

  // Stock card delete button
  const stockCardSectionEl = document.querySelector("#stock-card-section");
  stockCardSectionEl.addEventListener("click", function (e) {
    if (e.target.closest(".close-stock-card")) {
      const deleteStockCard = e.target.closest(".stock-card");
      deleteStockCard.remove();
    }
  });

  // Stock card addition button
  const stockCardAdditionEl = document.querySelector(".stock-card-adding");
  stockCardAdditionEl.addEventListener("click", function (e) {
    dialog.addStockCardModal();

    const dialogConfirmBtn = document.querySelector(".confirm_button--submit");
    const tickerInputEl = document.querySelector(".stock-card-input");
    tickerInputEl.focus();

    tickerInputEl.addEventListener("keypress", function (e) {
      if (e.key === "Enter") dialogConfirmBtn.click();
    });

    dialogConfirmBtn.addEventListener("click", async function () {
      const tickerInput = tickerInputEl.value.toUpperCase();
      document.querySelector(".confirm_dialog-background").remove();
      if (await fetchStockFromAPI.fetchStockInfo({ ticker: tickerInput })) {
        render.stockCard(tickerInput);
        currentStockCards.stocks.push(tickerInput);
        BrowserLocalStorage.addStockCard(tickerInput);
      }
    });

    document
      .querySelector(".confirm_button--cancel")
      .addEventListener("click", function () {
        document.querySelector(".confirm_dialog-background").remove();
      });
  });

  // To listen to empty space out of modal dialog box
  const bodyEl = document.querySelector("body");
  bodyEl.addEventListener("click", dialog.removeDialogBox);
};

/* --------------------- END of Button Control  ---------------------------*/

/* --------------------- Start of Editing Table Cells  ---------------------------*/
const editTableCell = function (tableCells) {
  tableCells.forEach((tableCell) => {
    if (tableCell.hasAttribute("data-clicked")) return;

    tableCell.setAttribute("data-clicked", "yes");
    tableCell.setAttribute("data-text", tableCell.innerHTML);

    const input = document.createElement("input");
    input.classList.add("tableCellInput");
    input.setAttribute("type", "text");

    input.value = tableCell.textContent;
    input.style.width = "100%";
    input.style.height =
      tableCell.offsetHeight + -tableCell.clientTop * 2 + "px";

    input.style.fontFamily = "inherit";
    input.style.fontSize = "inherit";
    input.style.textAlign = "inherit";
    input.style.color = "inherit";
    input.style.backgroundColor = "#D1D9D9";

    // document.querySelector("body").addEventListener("click", function (e) {
    //   console.log(e.target);
    //   if (!e.target.classList.contains("tableCellInput")) {
    //     input.blur();
    //   }
    // });

    const replaceOrKeepText = async function () {
      const tdEl = input.parentElement;
      const originalText = tdEl.getAttribute("data-text");
      const currentText = input.value.toUpperCase();

      if (originalText != currentText) {
        tdEl.removeAttribute("data-clicked");
        tdEl.removeAttribute("data-text");
        tdEl.innerHTML = currentText;

        tdEl.style.cssText = "padding: 1px;";

        if (tdEl.classList.contains("ticker")) {
          if (await fetchStockFromAPI.fetchStockInfo({ ticker: currentText })) {
            const trEl = tdEl.parentElement;
            const shares = trEl
              .querySelector(".shares")
              .getAttribute("data-text");
            const entry = utility.cleanNumberFormat(
              trEl.querySelector(".entry-price").getAttribute("data-text")
            );

            // Delete the old ticker from local storage and portfolio array
            deleteIndividualStockFromPortfolio(originalText);

            // Add the new ticker name along with old shares and entry info
            BrowserLocalStorage.addStock({
              ticker: currentText,
              shares: +shares,
              entry: +entry,
              acquiredDate: new Date().toISOString(),
            });
            currentPortfolio.add({
              ticker: currentText,
              shares: +shares,
              entry: +entry,
              acquiredDate: new Date().toISOString(),
            });
          }
          removePortfolioHtml();
          render.portfolio();
        } else if (tdEl.classList.contains("shares")) {
          if (!parseFloat(currentText) || parseFloat(currentText) <= 0) {
            fetchStockFromAPI.fetchStockInfoError();
            removePortfolioHtml();
            render.portfolio();
          } else {
            const trEl = tdEl.parentElement;
            const ticker = trEl
              .querySelector(".ticker")
              .getAttribute("data-text");
            const entry = utility.cleanNumberFormat(
              trEl.querySelector(".entry-price").getAttribute("data-text")
            );
            const index = currentPortfolio.stocks.findIndex(
              (stock) => stock.ticker === ticker
            );
            currentPortfolio.stocks[index].shares = parseFloat(currentText);

            BrowserLocalStorage.editStock(
              ticker,
              parseFloat(currentText),
              parseFloat(entry)
            );
            removePortfolioHtml();
            render.portfolio();
          }
        } else if (tdEl.classList.contains("entry-price")) {
          const newEntry = currentText.replace(/[$]/g, ""); // Replace $ sign from number $160 -> 160

          if (!parseFloat(newEntry) || parseFloat(newEntry) <= 0) {
            fetchStockFromAPI.fetchStockInfoError();
            removePortfolioHtml();
            render.portfolio();
          } else {
            const trEl = tdEl.parentElement;
            const ticker = trEl
              .querySelector(".ticker")
              .getAttribute("data-text");
            const shares = trEl
              .querySelector(".shares")
              .getAttribute("data-text");
            const index = currentPortfolio.stocks.findIndex(
              (stock) => stock.ticker === ticker
            );
            currentPortfolio.stocks[index].entry = parseFloat(newEntry);
            BrowserLocalStorage.editStock(
              ticker,
              parseFloat(shares),
              parseFloat(newEntry)
            );
            removePortfolioHtml();
            render.portfolio();
          }
        }
      } else {
        tdEl.removeAttribute("data-clicked");
        tdEl.removeAttribute("data-text");
        tdEl.innerHTML = originalText;
        tdEl.style.cssText = "padding: 1px;";

        removePortfolioHtml();
        render.portfolioNew();
      }
    };

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") this.blur();
    });
    input.addEventListener("blur", replaceOrKeepText);

    tableCell.innerHTML = "";
    tableCell.style.cssText = "padding: 0px 0px";
    tableCell.append(input);
  });
};

/* --------------------- END of Editing Table Cells  ---------------------------*/

export default {
  removePortfolioHtml,
  addStockFromInput,
  deletePortfolio,
  deleteIndividualStockFromPortfolio,
  initializeSamplePortfolio,
  initializeSampleStockCards,
  buttonsON,
};
