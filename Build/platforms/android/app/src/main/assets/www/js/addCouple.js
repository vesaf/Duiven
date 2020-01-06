// When page loaded
// document.addEventListener("DOMContentLoaded", function () {
function startAdd() {
    // Put current date in date input field
    var dateInput = document.getElementById("dateInput");
    dateInput.value = formatDateToInput();

    // When click on 'back' button go to index page
    document.addEventListener("click", function (e) {
        if (hasClass(e.target, "headerButton") || hasClass(e.target.parentElement, "headerButton")) {
            if (e.target.id === "backButton" || e.target.parentElement.id === "backButton") {
                window.open("./index.html", "_self");
            }
            else {
                alert("Onbekende knop.")
            }
        }
    });

    // When click on 'add' button collect and save data
    document.getElementById("addForm").addEventListener("submit", function(e) {
        e.preventDefault();
        saveData(collectData());
    }, false)
    // if (e.target.tagName == "BUTTON") 

    // Overwrite standard submit procedure
    var form = document.getElementById("addForm");
    form.addEventListener("submit", function () {
        return false;
    });
}
// }, false);

// Create couple object with data from input and return to caller
function collectData() {
    var dataPoint = {};
	dataPoint["bakNo"] = document.getElementById("bakNoInput").value;
    dataPoint["maleName"] = document.getElementById("maleNameInput").value;
    dataPoint["femaleName"] = document.getElementById("femaleNameInput").value;
    dataPoint["coupleDate"] = new Date(document.getElementById("dateInput").value);
//    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
    dataPoint["notes"] = document.getElementById("notesInput").value;
    return dataPoint;
}

// Save data in local storage
function saveData(dataPoint) {
    // Load current state of local storage
    var localStorage = window.localStorage;
    // If not first couple get last used ID
    if (localStorage.idCount) {
        var idCount = Number(localStorage.idCount);
    }
    // If first couple start with ID of 0
    else {
        var idCount = 0;
        localStorage.idCount = "0";
    }

    // Also in index.js and editCouple.js
    const cutoffDate = {
        day: 10,
        month: 12
    }
    var couples = loadData()["couples"];
    var couplesExt = [...couples];
    couplesExt[idCount] = dataPoint;
    let newYear = getYears(couplesExt, cutoffDate).filter(x => !getYears(couples, cutoffDate).includes(x));
    if (newYear.length > 0) {
        var filtered = (localStorage.filtered) ? localStorage.filtered.split(",") : [];
        filtered.push(newYear[0]);
        localStorage.filtered = filtered;
    }

    // Save couple at ID
    localStorage[idCount] =  JSON.stringify(dataPoint);
    if (device.platform === "Android") {
        try {
            const idCountInt = parseInt(idCount);
            // TODO: Turn on notifications
            // cordova.plugins.notification.local.schedule([
            //     { id: idCountInt * 4, title: dataPoint["femaleName"] + " legt het eerste ei van " + dataPoint["maleName"], trigger: { in: 10, unit: 'second', foreground: true } },
            //     { id: idCountInt * 4 + 1, title: dataPoint["femaleName"] + " legt het tweede ei van " + dataPoint["maleName"], trigger: { in: 20, unit: 'second', foreground: true } },
            //     { id: idCountInt * 4 + 2, title: "Het eerste ei van " + dataPoint["femaleName"] + " en " + dataPoint["maleName"] + " komt uit.", trigger: { in: 30, unit: 'second', foreground: true } },
            //     { id: idCountInt * 4 + 3, title: "De jongen van " + dataPoint["femaleName"] + " en " + dataPoint["maleName"] + " moeten geringd worden.", trigger: { in: 40, unit: 'second', foreground: true } }
            // ], function() {
                // Increment last used ID
                localStorage.idCount = (idCount + 1).toString();
                // Go back to main page
                window.open("./index.html", "_self");
            // });
        }
        catch(err) {
            alert("Kon geen notificaties inplannen. Stuur de volgende informatie naar de app ontwikkelaar: " + err);
            // Increment last used ID
            localStorage.idCount = (idCount + 1).toString();
            // Go back to main page
            window.open("./index.html", "_self");
        }
    }
    else {
        // Increment last used ID
        localStorage.idCount = (idCount + 1).toString();
        // Go back to main page
        window.open("./index.html", "_self");
    }

}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if (id == 'deviceready') {
            // cordova.plugins.notification.local.schedule({
            //     title: 'Design team meeting',
            //     trigger: { in: 30, unit: 'second' }
            // });
            if (device.platform === "Android") {
                cordova.plugins.notification.local.requestPermission(function (granted) {
                    startAdd();
                });
            }
            else {
                startAdd();
            }
        }
    }
};

app.initialize();