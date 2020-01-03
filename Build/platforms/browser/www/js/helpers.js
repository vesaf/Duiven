// Checks whether an element has a certain CSS class
function hasClass (element, className) {
    if (element && className && element.classList) {
        return (element.classList.contains(className));
    }
    else {
        return undefined;
    }
}

// Formats a date into standard European string format
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
    if (date instanceof Date && !isNaN(date)) {
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;
    }
    else {
        return null;
    }
}

// Adds days to a given date
function addDays(date = new Date(), days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Get the included seasons from the data
function getYears(couples, cutoffDate) {
    const ids = Object.keys(couples);
    var years = [];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const couple = couples[id];
        const realCutoffDate = new Date(couple.date1.getYear() + 1900, cutoffDate.month  - 1, cutoffDate.day, 0, 0, 0, 0);
        if (couple.date1 > realCutoffDate && years.indexOf(couple.date1.getYear() + 1901) === -1) {
            years.push(couple.date1.getYear() + 1901);
        }
        else if (couple.date1 <= realCutoffDate && years.indexOf(couple.date1.getYear() + 1900) === -1) {
            years.push(couple.date1.getYear() + 1900);
        }
    }
    years.sort();
    return years;
}

// Check if element or an ancestor has a given id
function ancestorHasId(el, id) {
    var outcome = (el.id === id);
    while (el.parentElement && !outcome) {
        el = el.parentElement;
        outcome = (el.id === id);
    }
    return outcome;
}

// Gets the couple data from local storage
function loadData() {
    var localStorage = window.localStorage;
    var maxIdCount = Number(localStorage.idCount);
    var data = {couples: []};
    for (var i = 0; i < maxIdCount; i++) {
        if (localStorage[i.toString()]) {
            var couple = JSON.parse(localStorage[i.toString()]);
            couple.id = i;
            couple.date1 = new Date(couple.date1);
            data.couples.push(couple);
        }
    }
    return data;
}