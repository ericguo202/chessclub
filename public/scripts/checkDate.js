const dateInput = document.querySelector("input[type='date']");

const today = new Date().toISOString().slice(0, 10);

dateInput.min = today;