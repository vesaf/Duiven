document.addEventListener("DOMContentLoaded", function () {

    var dateInput = document.getElementById("dateInput");
    dateInput.value = formatDateToInput();

    document.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasClass(e.target, "header-button") || hasClass(e.target.parentElement, "header-button")) window.open("./index.html", "_self");
        if (e.target.tagName == "BUTTON") collectData();
    });

    var form = document.getElementById("addForm");
    form.addEventListener("submit", function () {
        return false;
    });
}, false);

function collectData() {
    var dataPoint = {};
	dataPoint["bakNo"] = document.getElementById("bakNoInput").value;
    dataPoint["maleName"] = document.getElementById("maleNameInput").value;
    dataPoint["femaleName"] = document.getElementById("femaleNameInput").value;
    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
    dataPoint["notes"] = document.getElementById("notesInput").value;
    saveData(dataPoint);
}

function saveData(dataPoint) {
    var localStorage = window.localStorage;
    if (localStorage.idCount) {
        var idCount = Number(localStorage.idCount);
    }
    else {
        var idCount = 0;
        localStorage.idCount = "0";
    }
    localStorage[idCount] =  JSON.stringify(dataPoint);
    localStorage.idCount = (idCount + 1).toString();
    window.open("./index.html", "_self");
}