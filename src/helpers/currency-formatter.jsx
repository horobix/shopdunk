let currencyFormatter = (money) =>
  (+money)
    .toLocaleString("it-IT", { style: "currency", currency: "VND" })
    .replace("VND", "VNĐ");

export default currencyFormatter;
