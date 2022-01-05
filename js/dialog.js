const confirmDeletion = function () {
  const html = `
  <div class="confirm_dialog-background">
      <div class="confirm_dialog-box">
        <div class="confirm_dialog-title">
          <span>Delete Portfolio</span>
        </div>
        <div class="confirm_dialog-message">
          <span>Are you sure you want to delete all the stocks in your portfolio?</span>
        </div>
        <div class="confirm_dialog_btn-box">
          <button class="confirm_button--ok">Yes</button>
          <button class="confirm_button--cancel">No</button>
        </div>
      </div>
    </div>
    `;

  document.querySelector("body").insertAdjacentHTML("beforeend", html);
};

const confirmFetchError = function (stock) {
  const html = `
  <div class="confirm_dialog-background">
      <div class="confirm_dialog-box">
        <div class="confirm_dialog-title">
          <span>Error Encounted</span>
        </div>
        <div class="confirm_dialog-message">
          <span>Error encounted while fetching your request for <strong>${
            stock.ticker ? stock.ticker : stock
          }</strong>. Please make sure your stock data inputs are correct.</span>
        </div>
        <div class="confirm_dialog_btn-box">
          <button class="confirm_button--cancel">OK</button>
        </div>
      </div>
    </div>
    `;
  const errorModal = document.querySelector(".confirm_dialog-background");
  if (!errorModal) {
    document.querySelector("body").insertAdjacentHTML("beforeend", html);
  }
};

const addStockCardModal = function () {
  const html = `
  <div class="confirm_dialog-background">
      <div class="confirm_dialog-box">
        <div class="confirm_dialog-title">
          <span>Add A Stock Card</span>
        </div>
        <div class="confirm_dialog-message">
          <label>Type in the stock ticker you would like to add.</label>
          <input class="stock-card-input" type="text">
        </div>
        <div class="confirm_dialog_btn-box">
          <button class="confirm_button--submit">Submit</button>
          <button class="confirm_button--cancel">Cancel</button>
        </div>
      </div>
    </div>
    `;
  document.querySelector("body").insertAdjacentHTML("beforeend", html);
};

// To remove the dialog box and its background
const removeDialogBox = function () {
  document.querySelector("body").addEventListener("click", function (e) {
    if (
      e.target.classList.contains("confirm_dialog-background") ||
      e.target.classList.contains("confirm_button--cancel")
    ) {
      if (document.querySelector(".confirm_dialog-background"))
        document.querySelector(".confirm_dialog-background").remove();
    }
  });
  // if (e.target.classList.contains("confirm_dialog-background")) {
  //   document.querySelector(".confirm_dialog-background").remove();
  // }
  // document
  //   .querySelector(".confirm_button--cancel")
  //   .addEventListener("click", function () {
  //     document.querySelector(".confirm_dialog-background").remove();
  //   });
};

export default {
  confirmDeletion,
  confirmFetchError,
  addStockCardModal,
  removeDialogBox,
};
