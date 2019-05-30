// TODO: Red cross for things that didn't happen (instead of clock)
// TODO: notifications
// TODO: delete confirmation

// Handles page load event
document.addEventListener("DOMContentLoaded", function () {
    // Get data from storage
    var data = loadData();
    var listContent = "";
    var ids = Object.keys(data["couples"]);
    // Add couples to list
    for (let i = 0; i < ids.length; i++) {
        id = ids[i];
        var couple = data["couples"][id];
        // Set relevant dates and their html elements
        var date1 = couple.date1;
        var date2 = addDays(date1, 2);
        var date3 = addDays(date1, 18);
        var date4 = addDays(date1, 25);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 1);
        var date1Icon = (today >= date1) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date2Checked = (couple["egg2LayedAbn"] !== undefined) ? couple["egg2LayedAbn"] : today >= date2;
        var date2Icon = (date2Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date3Checked = (couple["egg1DoneAbn"] !== undefined|| couple["egg2DoneAbn"] !== undefined) ? couple["egg1DoneAbn"] && couple["egg2DoneAbn"] : today >= date3;
        var date3Icon = (date3Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date4Checked = (couple["ringedAbn"] !== undefined) ? couple["ringedAbn"] : today >= date4;
        var date4Icon = (date4Checked) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';

		const coupleHeader = (couple.bakNo) ? couple.bakNo + " " + couple.maleName + " & " + couple.femaleName : couple.maleName + " & " + couple.femaleName;
		
        // Compile couple card html
        listContent += `
            <li class="card" id="couple` + couple.id + `">
                <div class="listItem">
                    <p class="coupleName">` + coupleHeader + `</p>
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
                    </table>
                    <div class="editButton">
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
    var list = document.getElementById("mainList");
    list.innerHTML = listContent;

    // If there are no couple data yet insert explanation of what to do
    if (ids.length === 0) {
        document.getElementById("container").innerHTML = "<p id='explanationText'> Klik rechts boven op het plusje om een koppel toe te voegen. </p>"
    }

    // Handles click events
	document.addEventListener("click", function (e) {
        // Handles click on header add button
		if (hasClass(e.target, "header-button") || hasClass(e.target.parentElement, "header-button")) {
            window.open("./addCouple.html", "_self");
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
}, false);

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

// Removes a couple from local storage
function removeCouple(coupleNo) {
    var localStorage = window.localStorage;
    delete localStorage[coupleNo];
    location.reload();
}