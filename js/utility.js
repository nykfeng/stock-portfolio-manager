function formatNumber(number) {
  //   console.log(`number is ${number}`);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function cleanNumberFormat(numberString) {
  return numberString.substring(1, numberString.length).replace(/[,]+/g, "");
}

export default { formatNumber, cleanNumberFormat };
