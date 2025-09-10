const dateSpans = document.querySelectorAll(".post-date");

for (const span of dateSpans) {
    const date = new Date(span.dataset.date);
    span.innerText = date.toLocaleString();
}

