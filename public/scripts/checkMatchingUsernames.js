const newUn = document.querySelector("#newUn");
const confirmUn = document.querySelector("#confirmUn");

const changeUnForm = document.querySelector("#changeUnForm");

changeUnForm.addEventListener("submit", (event) => {
    confirmUn.setCustomValidity("");

    if (newUn.value !== confirmUn.value) {
        confirmUn.setCustomValidity("Usernames do not match!");
    }

    if (!changeUnForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    checkUnForm.classList.add("was-validated");
});

confirmUn.addEventListener("change", () => {
    if (newUn.value !== confirmUn.value) {
        confirmUn.setCustomValidity("Usernames do not match!");
    }
    else {
        confirmUn.setCustomValidity("");
    }
})