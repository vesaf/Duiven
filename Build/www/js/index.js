// TODO: Red cross for things that didn't happen (instead of clock)
// TODO: notifications
// TODO: delete confirmation

// Handles page load event
// document.addEventListener("DOMContentLoaded", function () {
function startApp() {
    // Start/end date of the breeding season (also in addCouple.js and editCouple.js)
    const cutoffDate = {
        day: 10,
        month: 12
    }

    // Get data from storage
    var data = loadData();
    if (window.localStorage.filtered === undefined) {
        window.localStorage.filtered = getYears(data["couples"], cutoffDate);
    }

    if (Object.keys(data["couples"]).length > 0) {
        document.getElementById("container").innerHTML = "<input id='searchBar' placeholder='Zoeken'></input>" + document.getElementById("container").innerHTML;
        document.getElementById("searchBar").addEventListener("keyup", function (e) {
            const query = document.getElementById("searchBar").value;
            const filtered = (window.localStorage.filtered) ? window.localStorage.filtered.split(",") : [];
            const results = search(filter(data["couples"], filtered, cutoffDate), query);
            showData(results);
        });
        setInterval(function show() {
            const filtered = (window.localStorage.filtered) ? window.localStorage.filtered.split(",") : [];
            if (document.getElementById("searchBar").value === "") {
                showData(filter(data["couples"], filtered, cutoffDate));
            }
            else {
                const query = document.getElementById("searchBar").value;
                const results = search(filter(data["couples"], filtered, cutoffDate), query);
                showData(results);
            }
            return show;
        }(), 10000);

    }
    else {
        document.getElementById("container").innerHTML = "<p id='explanationText'> Klik rechts onder op het plusje om een koppel toe te voegen. </p>";
        
    }
   

    // Handles click events
	document.addEventListener("click", function (e) {
        // Handles click on header add button
		if (hasClass(e.target, "button") || hasClass(e.target.parentElement, "button")) {
            if (e.target.id === "addButtonContainer" || e.target.parentElement.id === "addButtonContainer" || 
			e.target.id === "addButton" || e.target.parentElement.id === "addButton") {
                window.open("./addCouple.html", "_self");
            }
            else if (e.target.id === "filterButton" || e.target.parentElement.id === "filterButton") {
                loadFilterMenu(data["couples"], cutoffDate);
            }
            else {
                alert("Onbekende knop.")
            }
        }
        // Handles click on couple remove button
        if (hasClass(e.target, "removeButton") || hasClass(e.target.parentElement, "removeButton")) {
            var button = (hasClass(e.target, "removeButton")) ? e.tagret : e.target.parentElement;
            var card = button.parentElement.parentElement;
            var coupleId = card.id.substring(6);
            removeCouple(coupleId);
        }
        // Handles click on couple edit button
        if (hasClass(e.target, "editButton") || hasClass(e.target.parentElement, "editButton")) {
            var button = (hasClass(e.target, "editButton")) ? e.target : e.target.parentElement;
            var card = button.parentElement.parentElement;
            var coupleId = card.id.substring(6);
            window.open("./editCouple.html?id=" + coupleId, "_self");
        }
    });
}
// }, false);

// Removes a couple from local storage
function removeCouple(coupleNo) {
    var localStorage = window.localStorage;
    delete localStorage[coupleNo];
    // cordova.plugins.notification.local.cancel(parseInt(coupleNo) * 4);
    // cordova.plugins.notification.local.cancel(parseInt(coupleNo) * 4 + 1);
    // cordova.plugins.notification.local.cancel(parseInt(coupleNo) * 4 + 2);
    // cordova.plugins.notification.local.cancel(parseInt(coupleNo) * 4 + 3);
    location.reload();
}

function search(couples, query) {
    if (query === "") {
        return couples;
    }
    query = query.toLowerCase();
    const ids = Object.keys(couples);
    var results = {}
    const queryList = query.split(" ");
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const couple = couples[id];
        var coupleHeader = (couple.bakNo) ? couple.bakNo + " " + couple.maleName + " & " + couple.femaleName + " " + couple.notes : couple.maleName + " & " + couple.femaleName + " " + couple.notes;
        coupleHeader = coupleHeader.toLowerCase();
        var found = 0;
        for (let j = 0; j < queryList.length; j++) {
            const subQuery = queryList[j];
            if (coupleHeader.indexOf(subQuery) >= 0) {
                found++;
            }
        }
        if (found === queryList.length) {
            results[id] = couple;
        }
    }
    return results;
}

function showData(couples) {
    var listContent = "";
    var ids = Object.keys(couples);
    // Add couples to list
    for (let i = 0; i < ids.length; i++) {
        id = ids[ids.length - i - 1];
        var couple = couples[id];
        // Set relevant dates and their html elements
        // TODO: make sure all dates have copied time
        var date1 = couple.date1;
        if (date1) {
            var date2 = addDays(date1, 2);
            var date3 = addDays(date1, 18);
            var date4 = addDays(date1, 25);
        }
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 1);
        var date1Icon = (date1 && today >= date1) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date2Checked = (couple["egg2LayedAbn"] !== undefined) ? couple["egg2LayedAbn"] : (date2 && today >= date2);
        var date2Icon = (date2Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date3Checked = (couple["egg1DoneAbn"] !== undefined|| couple["egg2DoneAbn"] !== undefined) ? couple["egg1DoneAbn"] && couple["egg2DoneAbn"] : today >= date3;
        var date3Icon = (date3Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date4Checked = (couple["ringedAbn"] !== undefined) ? couple["ringedAbn"] : today >= date4;
        var date4Icon = (date4Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        const coupleHeader = (couple.bakNo) ? couple.bakNo + " " + couple.maleName + " & " + couple.femaleName : couple.maleName + " & " + couple.femaleName;
        const dateInformation = (formatDateToString(date1) !== null) ? `
        <table>
            <tr>
                <td class="date1Label"> Legdatum eerste ei: ` + formatDateToString(date1) + `</td>
                <td>` + 
                    date1Icon + `
                </td>
                <td class="date2Label"> Legdatum tweede ei: ` + formatDateToString(date2) + `</td>
                <td>` +
                    date2Icon + `
                </td>
            </tr>
            <tr>
                <td class="date3Label"> Uitkomst datum: ` + formatDateToString(date3) + `</td>
                <td>` +
                    date3Icon + `
                </td>
                <td class="date4Label"> Ringdatum: ` + formatDateToString(date4) + `</td>
                <td>` +
                    date4Icon + `
                </td>
            </tr>
        </table>` : `<p>Er is nog geen legdatum bekend.</p>`;
        // Compile couple card html
        listContent += `
            <li class="card" id="couple` + couple.id + `">
                <div class="listItem">
                    <p class="coupleName">` + coupleHeader + `</p>` +
                    dateInformation +
                    `<div class="editButton">
                        <i class="far fa-edit"></i>
                        <p class="editLabel">Bewerken</p> 
                    </div>
                    <div class="removeButton">
                        <i class="far fa-trash-alt"></i>
                        <p class="removeLabel">Verwijderen</p> 
                    </div>
                </div>
            </li>
        `;
    }
    document.getElementById("mainList").innerHTML = listContent;
}

function loadFilterMenu(couples, cutoffDate) {
    var filtered = (window.localStorage.filtered) ? window.localStorage.filtered.split(",") : [];

    var years = getYears(couples, cutoffDate);

    var liItems = "";
    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        var checked = (filtered.indexOf(year.toString()) === -1) ? "" : "checked";
        liItems += `
        <li>
            <input class="filterCheckbox" type="checkbox" id="checkbox` + year + `" ` + checked + `>
            <p class="yearLabel" id="yearLabel` + year + `">` + year + `</p>
        </li>
        `;
    }

    if (liItems.length > 0) {
        document.getElementById("headerButtonContainer").innerHTML += `
            <div id="filterMenu">
                <ul id="filterList">` +
                    liItems +
                `
                </ul>
            </div>
        `;

        document.addEventListener("click", filterClicks);
    }

    function filterClicks(e) {
        if (!ancestorHasId(e.target, "filterMenu")) {
            document.getElementById("filterMenu").parentElement.removeChild(document.getElementById("filterMenu"));
            document.removeEventListener("click", filterClicks);
        }
        else if (e.target.id.substring(0, 8) === "checkbox" || hasClass(e.target, "yearLabel")) {
            const year = e.target.id.slice(e.target.id.length - 4);
            if (hasClass(e.target, "yearLabel")) {
                document.getElementById("checkbox" + year).checked = !document.getElementById("checkbox" + year).checked;
            }
            if (filtered.indexOf(year) === -1) {
                filtered.push(year)
            }
            else {
                filtered.splice(filtered.indexOf(year), 1);
            }
            window.localStorage.filtered = filtered;
            showData(filter(couples, filtered, cutoffDate));
        }
    }
}

function filter(couples, years, cutoffDate) {
    const cutoffDay = cutoffDate.day;
    const cutoffMonth = cutoffDate.month;
    const ids = Object.keys(couples);
    var couplesOut = [];
    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < years.length; j++) {
            const id = ids[i];
            var couple = couples[id];
            const year = years[j];
            const lowerBound = new Date(year - 1, cutoffMonth - 1, cutoffDay, 0, 0, 0, 0);
            const upperBound = new Date(year, cutoffMonth - 1, cutoffDay, 0, 0, 0, 0);
            // couple.coupleDate = new Date(couple.coupleDate);
            if ((couple.coupleDate > lowerBound && couple.coupleDate <= upperBound)) {
                couplesOut[id] = couple;
            }
        }
    }
    return couplesOut;
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
            startApp();
        }
    }
};

app.initialize();