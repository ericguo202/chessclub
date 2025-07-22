const addCommentButton = document.querySelector("#addCommentButton");
const commentForm = document.querySelector("#commentForm");

addCommentButton.addEventListener("click", () => {
    commentForm.classList.toggle("hidden");
    addCommentButton.classList.add("hidden");
});

