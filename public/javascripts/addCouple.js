document.addEventListener("DOMContentLoaded", function () {

    var dateInput = document.getElementById("dateInput");
    dateInput.value = formatDate();

    document.addEventListener("click", function (e) {
        if (isHeaderButton(e.target) || isHeaderButton(e.target.parentElement)) window.open("./index.html", "_self");
        if (e.target.tagName == "BUTTON") collectData();
    });

    var form = document.getElementById("addForm");
    form.addEventListener("submit", function () {
        return false;
    });
}, false);

function isHeaderButton(element) {
    if (element) return (element.classList.contains("header-button"));
    else return false;
}

function formatDate(date = new Date()) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}-${month}-${day}`;
}

function collectData() {
    var dataPoint = {};
    dataPoint["maleName"] = document.getElementById("maleNameInput").value;
    dataPoint["femaleName"] = document.getElementById("femaleNameInput").value;
    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
    dataPoint["notes"] = document.getElementById("notesInput").value;
    saveData(dataPoint);
}

function saveData(dataPoint) {
    var localStorage = window.localStorage;
    if (localStorage.idCount)
        var idCount = Number(localStorage.idCount);
    else {
        var idCount = 0;
        localStorage.idCount = "0";
    }
    localStorage[idCount] =  JSON.stringify(dataPoint);
    localStorage.idCount = (idCount + 1).toString();
    window.open("./index.html", "_self");
}