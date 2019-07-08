// When page loaded
// document.addEventListener("DOMContentLoaded", function () {
function startAdd() {
    // Put current date in date input field
    var dateInput = document.getElementById("dateInput");
    dateInput.value = formatDateToInput();

    // When click on 'back' button go to index page
    document.addEventListener("click", function (e) {
        if (hasClass(e.target, "header-button") || hasClass(e.target.parentElement, "header-button")) {
            window.open("./index.html", "_self");
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
    dataPoint["date1"] = new Date(document.getElementById("dateInput").value);
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
    // Save couple at ID
    localStorage[idCount] =  JSON.stringify(dataPoint);
    // Increment last used ID
    localStorage.idCount = (idCount + 1).toString();
    try {
        // alert("ALERT 1");
        cordova.plugins.notification.local.schedule([
            { id: 1, title: dataPoint["femaleName"] + " legt het eerste ei van " + dataPoint["maleName"], trigger: { in: 10, unit: 'second', foreground: true } },
            { id: 2, title: dataPoint["femaleName"] + " legt het tweede ei van " + dataPoint["maleName"], trigger: { in: 20, unit: 'second', foreground: true } }
        ]);
        // alert("ALERT 2");
    }
    catch(err) {
        alert(err);
    }
    // Go back to main page
    try {
        window.open("./index.html", "_self");
    }
    catch(err) {
        alert(err);
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
            cordova.plugins.notification.local.requestPermission(function (granted) {
                startAdd();
            });
        }
    }
};

app.initialize();