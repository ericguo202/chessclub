
const allEventsContainer = document.querySelector("#allEventsContainer");
const events = Array.from(document.querySelectorAll(".event"));

events.sort(function (a, b) {
    // get the date information from data-date for each event div
    const aDate = new Date(a.dataset.date);
    const bDate = new Date(b.dataset.date);

    // const testDate1 = new Date("2025-11-24");
    // const testDate2 = new Date("2026-05-18");

    // console.log(testDate1, testDate2, testDate1 - testDate2);

    /*
    Date logic: If date A - date B < 0, date A is older than date B
    
    If date A - date B > 0, date A is newer than date B
    The sort method expects a return that is a number. If number is positive, then A should come after B.
    If the number is negative, then A should come before B.

    So, we want to sort dates from oldest to newest. So, if A is older than B, then aDate - bDate is negative.
    If A is newer than B, then aDate - bDate is positive. So, we return aDate - bDate.
    */

    return aDate - bDate;
});

allEventsContainer.innerHTML = "";

for (const event of events) {
    allEventsContainer.append(event);
}