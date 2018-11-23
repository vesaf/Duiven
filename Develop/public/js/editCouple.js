document.addEventListener("DOMContentLoaded", function () {
    // Load couple data
    var coupleData = getDataFromDb();
    // Enter couple data into inputs
    enterData(coupleData);

    // Listen for click on header button (then go back to main page), or click on submit button (then submit data)
    document.addEventListener("click", function (e) {
        if (hasClass(e.target, "header-button") || hasClass(e.target.parentElement, "header-button")) window.open("./index.html", "_self");
        else if (e.target.tagName == "BUTTON") {
            e.preventDefault();
            collectData(coupleData.id);
        }
    });

    // Disable submit to server
    // TODO: check if I can do collectData here instead of in click event listener
    var form = document.getElementById("editForm");
    form.addEventListener("submit", function () {
        return false;
    });

    // Set checkboxes on date change
    document.getElementById("dateInput").addEventListener("change", function () {
        var date1 = new Date(document.getElementById("dateInput").value);
        var today = new Date();
        var date2 = addDays(date1, 2);
        var date3 = addDays(date1, 18);
        var date4 = addDays(date1, 25);
        document.getElementById("egg2LayedCheckbox").checked = today >= date2;
        document.getElementById("egg1DoneCheckbox").checked = today >= date3;
        document.getElementById("egg2DoneCheckbox").checked = today >= date3;
        document.getElementById("ringedCheckbox").checked = today >= date4;
    });

    // Disable possible illogical checkbox combinations
    var checkboxContainer = document.getElementById("checkboxContainer");
    checkboxContainer.addEventListener("change", function (e) {
        if (!document.getElementById("egg2LayedCheckbox").checked) {
            document.getElementById("egg2DoneCheckbox").checked = false;
            document.getElementById("egg2DoneCheckbox").disabled = true;
        }
        else {
            document.getElementById("egg2DoneCheckbox").disabled = false;
        }
        if (!document.getElementById("egg1DoneCheckbox").checked && !document.getElementById("egg2DoneCheckbox").checked) {
            document.getElementById("ringedCheckbox").checked = false;
            document.getElementById("ringedCheckbox").disabled = true;
        }
        else {
            document.getElementById("ringedCheckbox").disabled = false;
        }
    });
}, false);

// Collect data from database
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
	if (coupleData.bakNo) {
		document.getElementById("bakNoInput").value = coupleData.bakNo;
	}
    document.getElementById("maleNameInput").value = coupleData.maleName;
    document.getElementById("femaleNameInput").value = coupleData.femaleName;
    document.getElementById("dateInput").value = formatDateToInput(coupleData.date1);
    document.getElementById("notesInput").value = coupleData.notes;
    var today = new Date();
    var date1 = coupleData.date1;
    var date2 = addDays(date1, 2);
    var date3 = addDays(date1, 18);
    var date4 = addDays(date1, 25);
    // Enter checkboxes first based on database then on date
    document.getElementById("egg2LayedCheckbox").checked = (coupleData["egg2LayedAbn"] !== undefined) ? coupleData["egg2LayedAbn"] : today >= date2;
    document.getElementById("egg1DoneCheckbox").checked = (coupleData["egg1DoneAbn"] !== undefined) ? coupleData["egg1DoneAbn"] : today >= date3;
    document.getElementById("egg2DoneCheckbox").checked = (coupleData["egg2DoneAbn"] !== undefined) ? coupleData["egg2DoneAbn"] : today >= date3;
    document.getElementById("ringedCheckbox").checked = (coupleData["ringedAbn"] !== undefined) ? coupleData["ringedAbn"] : today >= date4;
}

// Collect data from inputs
function collectData(id) {
    var dataPoint = {};
    var today = new Date();
    var date1 = new Date(document.getElementById("dateInput").value);
    var date2 = addDays(date1, 2);
    var date3 = addDays(date1, 18);
    var date4 = addDays(date1, 25);
    // Check for abnormalities in checkboxes and set boolean varibles accordingly
    // TODO: maybe loop through object instead (with id and date in obj)
    if (today >= date2 && !document.getElementById("egg2LayedCheckbox").checked) {
        dataPoint["egg2LayedAbn"] = false;
    }
    else if (date2 >= today && document.getElementById("egg2LayedCheckbox").checked) {
        dataPoint["egg2LayedAbn"] = true;
    }
    else {
        dataPoint["egg2LayedAbn"] = undefined;
    }

    if (today >= date3 && !document.getElementById("egg1DoneCheckbox").checked) {
        dataPoint["egg1DoneAbn"] = false;
    }
    else if (date3 >= today && document.getElementById("egg1DoneCheckbox").checked) {
        dataPoint["egg1DoneAbn"] = true;
    }
    else {
        dataPoint["egg1DoneLayedAbn"] = undefined;
    }

    if (today >= date3 && !document.getElementById("egg2DoneCheckbox").checked) {
        dataPoint["egg2DoneAbn"] = false;
    }
    else if (date3 >= today && document.getElementById("egg2DoneCheckbox").checked) {
        dataPoint["egg2DoneAbn"] = true;
    }
    else {
        dataPoint["egg2DoneLayedAbn"] = undefined;
    }

    if (today >= date4 && !document.getElementById("ringedCheckbox").checked) {
        dataPoint["ringedAbn"] = false;
    }
    else if (date4 >= today && document.getElementById("ringedCheckbox").checked) {
        dataPoint["ringedAbn"] = true;
    }
    else {
        dataPoint["ringeddAbn"] = undefined;
    }
	dataPoint["bakNo"] = document.getElementById("bakNoInput").value;
    dataPoint["maleName"] = document.getElementById("maleNameInput").value;
    dataPoint["femaleName"] = document.getElementById("femaleNameInput").value;
    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
    dataPoint["notes"] = document.getElementById("notesInput").value;
    // Save data to db
    saveData(dataPoint, id);
}

// Saves data to db
function saveData(dataPoint, id) {
    var localStorage = window.localStorage;
    localStorage[id] =  JSON.stringify(dataPoint);
    window.open("./index.html", "_self");
}