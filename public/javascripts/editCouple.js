// TODO: comment
// TODO: abnormal situations

document.addEventListener("DOMContentLoaded", function () {
    var coupleData = getDataFromDb();
    enterData(coupleData);

    document.addEventListener("click", function (e) {
        e.preventDefault();
        if (hasClass(e.target, "header-button") || hasClass(e.target.parentElement, "header-button")) window.open("./index.html", "_self");
        if (e.target.tagName == "BUTTON") collectData(coupleData.id);
    });

    var form = document.getElementById("editForm");
    form.addEventListener("submit", function () {
        return false;
    });
}, false);

function getDataFromDb() {
    const localStorage = window.localStorage;
    var id = window.location.search.substring(4);
    var coupleData = JSON.parse(localStorage[id]);
    coupleData.date1 = new Date(coupleData.date1);
    coupleData.id = id;
    return coupleData;
}

// Enters data into inputs and checkboxes
function enterData(coupleData) {
    document.getElementById("maleNameInput").value = coupleData.maleName;
    document.getElementById("femaleNameInput").value = coupleData.femaleName;
    document.getElementById("dateInput").value = formatDateToInput(coupleData.date1);
    document.getElementById("notesInput").value = coupleData.notes;
    var today = new Date();
    var date1 = coupleData.date1;
    var date2 = addDays(date1, 2);
    var date3 = addDays(date1, 18);
    var date4 = addDays(date1, 25);
    // TODO: first check if abnormal situation
    document.getElementById("egg2LayedCheckbox").checked = (today > date2);
    document.getElementById("egg1DoneCheckbox").checked = (today > date3);
    document.getElementById("egg2DoneCheckbox").checked = (today > date3);
    document.getElementById("ringedCheckbox").checked = (today > date4);
}

// TODO: implement abnormal situations
function collectData(id) {
    var dataPoint = {};
    dataPoint["maleName"] = document.getElementById("maleNameInput").value;
    dataPoint["femaleName"] = document.getElementById("femaleNameInput").value;
    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
    dataPoint["notes"] = document.getElementById("notesInput").value;
    saveData(dataPoint, id);
}

function saveData(dataPoint, id) {
    var localStorage = window.localStorage;
    localStorage[id] =  JSON.stringify(dataPoint);
    window.open("./index.html", "_self");
}