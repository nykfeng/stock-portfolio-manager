export default function () {
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
}
