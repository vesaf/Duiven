// When page loaded
function startEdit () {
    // Load couple data
    var coupleData = getDataFromDb();
    // Enter couple data into inputs
    enterData(coupleData);

    // Listen for click on header button (then go back to main page)
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

    // Disable standard submit procedure and collect data
    var form = document.getElementById("editForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Save data to db
        saveData(collectData(), coupleData.id);
    });

    // Set checkboxes on date change
    document.getElementById("eggDateInput").addEventListener("change", function () {
        var date1 = new Date(document.getElementById("eggDateInput").value);
        if (date1 instanceof Date && !isNaN(date1)) {
            var today = new Date();
            var date2 = addDays(date1, 2);
            var date3 = addDays(date1, 18);
            var date4 = addDays(date1, 25);
            document.getElementById("egg2LayedCheckbox").checked = today >= date2;
            document.getElementById("egg1DoneCheckbox").checked = today >= date3;
            document.getElementById("egg2DoneCheckbox").checked = today >= date3;
            document.getElementById("ringedCheckbox").checked = today >= date4;
        }
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
}

// Collect data from database
function getDataFromDb() {
    // Load current state of local storage
    const localStorage = window.localStorage;
    // Get relevant ID from URL
    var id = window.location.search.substring(4);
    // Get ID's data from storage
    var coupleData = JSON.parse(localStorage[id]);
    if (coupleData.date1 && !coupleData.coupleDate) {
        coupleData.coupleDate = new Date(coupleData.date1);
    }
    else {
        coupleData.coupleDate = new Date(coupleData.coupleDate);
    }
    if (coupleData.date1 !== null) {
        coupleData.date1 = new Date(coupleData.date1);
    }
    coupleData.id = id;
    return coupleData;
}

// Enters data into inputs and checkboxes
function enterData(coupleData) {
    // Necessary for backwards compatibility
	if (coupleData.bakNo) {
		document.getElementById("bakNoInput").value = coupleData.bakNo;
	}
    document.getElementById("maleNameInput").value = coupleData.maleName;
    document.getElementById("femaleNameInput").value = coupleData.femaleName;
    document.getElementById("dateInput").value = formatDateToInput(coupleData.coupleDate);
    document.getElementById("eggDateInput").value = formatDateToInput(coupleData.date1);
    document.getElementById("notesInput").value = coupleData.notes;
    var today = new Date();
    var date1 = coupleData.date1;
    if (date1) {
        var date2 = addDays(date1, 2);
        var date3 = addDays(date1, 18);
        var date4 = addDays(date1, 25);
        // Enter checkboxes first based on database then on date
        document.getElementById("egg2LayedCheckbox").checked = (coupleData["egg2LayedAbn"] !== undefined) ? coupleData["egg2LayedAbn"] : today >= date2;
        document.getElementById("egg1DoneCheckbox").checked = (coupleData["egg1DoneAbn"] !== undefined) ? coupleData["egg1DoneAbn"] : today >= date3;
        document.getElementById("egg2DoneCheckbox").checked = (coupleData["egg2DoneAbn"] !== undefined) ? coupleData["egg2DoneAbn"] : today >= date3;
        document.getElementById("ringedCheckbox").checked = (coupleData["ringedAbn"] !== undefined) ? coupleData["ringedAbn"] : today >= date4;
    }
}

// Collect data from inputs and return to caller
function collectData() {
    var dataPoint = {};
    var today = new Date();
    var coupleDate = new Date(document.getElementById("dateInput").value);
    var date1 = copyTimeToDate(new Date(document.getElementById("eggDateInput").value), today);
    var date2 = addDays(date1, 2);
    date2.setHours(14);
    date2.setMinutes(0);
    date2.setSeconds(0);
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
    dataPoint["date1"] = date1;
    dataPoint["coupleDate"] = coupleDate;
    dataPoint["notes"] = document.getElementById("notesInput").value;
    return dataPoint;
}

// Saves data to db
function saveData(dataPoint, id) {
    var localStorage = window.localStorage;

    // Also in index.js and addCouple.js
    const cutoffDate = {
        day: 10,
        month: 12
    }
    var couples = loadData()["couples"];
    var couplesExt = [...couples];
    couplesExt[id] = dataPoint;
    let newYear = getYears(couplesExt, cutoffDate).filter(x => !getYears(couples, cutoffDate).includes(x));
    if (newYear.length > 0) {
        var filtered = (localStorage.filtered) ? localStorage.filtered.split(",") : [];
        filtered.push(newYear[0]);
        localStorage.filtered = filtered;
    }

    localStorage[id] =  JSON.stringify(dataPoint);
    updateNotifications(dataPoint, id, function() {
        window.open("./index.html", "_self");
    });
}

function updateNotifications(dataPoint, id, callback){
    if (device.platform === "Android") {
        id = parseInt(id);

        cordova.plugins.notification.local.cancel(id * 4);
        cordova.plugins.notification.local.cancel(id * 4 + 1);
        cordova.plugins.notification.local.cancel(id * 4 + 2);
        cordova.plugins.notification.local.cancel(id * 4 + 3);

        const today = new Date();
        var date1 = dataPoint.date1;
        if (date1) {
            date1 = new Date(date1);
            var date2 = addDays(date1, 2);
            date2.setHours(14);
            date2.setMinutes(0);
            date2.setSeconds(0);
            var date3 = addDays(date1, 18);
            var date4 = addDays(date1, 25);

            // date2 = date1.setSeconds(date1.getSeconds() + 10);
            // date3 = date1.setSeconds(date1.getSeconds() + 10);
            // date4 = date1.setSeconds(date1.getSeconds() + 10);
            var notifications = [];
            if (date4 >= today) {
                // notifications.push({ id: id * 4 + 3, title: "De jongen van " + dataPoint["femaleName"] + " en " + dataPoint["maleName"] + " moeten geringd worden.", trigger: { in: 40, unit: 'second', foreground: true } });
                notifications.push({ id: id * 4 + 3, title: "De jongen van " + dataPoint["femaleName"] + " en " + dataPoint["maleName"] + " moeten geringd worden.", trigger: { at: date4, foreground: true } });
                if (date3 >= today) {
                    notifications.push({ id: id * 4 + 2, title: "Het eerste ei van " + dataPoint["femaleName"] + " en " + dataPoint["maleName"] + " komt uit.", trigger: { at: date3, foreground: true } });
                    if (date2 >= today) {
                        notifications.push({ id: id * 4 + 1, title: dataPoint["femaleName"] + " legt het tweede ei van " + dataPoint["maleName"], trigger: { at: date2, foreground: true } });
                        // if (date1 >= today) {
                        //     notifications.push({ id: id * 4, title: dataPoint["femaleName"] + " legt het eerste ei van " + dataPoint["maleName"], trigger: { in: 10, unit: 'second', foreground: true } })
                        // }
                    }
                }
            }
            cordova.plugins.notification.local.schedule(notifications, callback);
        }
        else {
            callback();
        }
    }
    else {
        callback();
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
                    startEdit();
                });
            }
            else {
                startEdit();
            }
        }
    }
};

app.initialize();