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
function formatDateToString(date) {
    if (date instanceof Date && !isNaN(date)) {
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return `${day}/${month}/${year}`;
    }
    else {
        return null;
    }
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
        couple.coupleDate = new Date(couple.coupleDate);
        const realCutoffDate = new Date(couple.coupleDate.getYear() + 1900, cutoffDate.month  - 1, cutoffDate.day, 0, 0, 0, 0);
        if (couple.coupleDate > realCutoffDate && years.indexOf(couple.coupleDate.getYear() + 1901) === -1) {
            years.push(couple.coupleDate.getYear() + 1901);
        }
        else if (couple.coupleDate <= realCutoffDate && years.indexOf(couple.coupleDate.getYear() + 1900) === -1) {
            years.push(couple.coupleDate.getYear() + 1900);
        }
    }
    years.sort();
    return years;
}

function copyTimeToDate(target, time) {
    return new Date(target.getFullYear(), target.getMonth(), target.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
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
            // Test to support legacy code
            if (couple.date1) {
                if (!couple.coupleDate) {
                    couple.coupleDate = new Date(couple.date1);
                }
                couple.date1 = new Date(couple.date1);
            }
            if (couple.coupleDate) {
                couple.coupleDate = new Date(couple.coupleDate);
            }
            data.couples.push(couple);
        }
    }
    return data;
}