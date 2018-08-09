// Checks whether an element has a certain class
function hasClass (element, className) {
    return (element.classList.contains(className));
}

// Formats a date so that it goes into a string
function formatDateToString(date = new Date()) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}/${month}/${year}`;
}

// Formats date so it goes in a date input
function formatDateToInput(date = new Date()) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}-${month}-${day}`;
}

// Adds days to a given date
function addDays(date = new Date(), days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}