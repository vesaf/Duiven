var data = {
    "couples": [
        {
            "name": "Koppel 1",
            "date1": new Date()
        },
        {"name": "Koppel 2"},
        {"name": "Koppel 3"},
    ]
};

// Handles page load event
document.addEventListener("DOMContentLoaded", function () {
    // Get data from storage
    var data = loadData();
    var listContent = "";
    var keys = Object.keys(data["couples"]);
    // Add couples to list
    for (let i = 0; i < Object.keys(data["couples"]).length; i++) {
        key = Object.keys(data["couples"])[i];
        var couple = data["couples"][Object.keys(data["couples"])[i]];
        // Set relevant dates and their html elements
        var date1 = couple.date1;
        var date2 = addDays(date1, 2);
        var date3 = addDays(date1, 18);
        var date4 = addDays(date1, 25);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() + 1);
        var date1Icon = (today >= date1) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date2Icon = (today >= date2) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date3Icon = (today >= date3) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        var date4Icon = (today >= date4) ? '<i class="fa fa-check"></i>' : '<i class="far fa-clock"></i>';
        // Compile couple card html
        listContent += `
            <li class="card" id="couple` + couple.id + `">
                <div class="listItem">
                    <p class="coupleName">` + couple.maleName + ` & ` + couple.femaleName + `</p>
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
            var coupleNo = card.id.substring(6);
            removeCouple(coupleNo);
        }
        // Handles click on couple edit button
        if (hasClass(e.target, "editButton") || hasClass(e.target.parentElement, "editButton")) {
            var button = (hasClass(e.target, "editButton")) ? e.target : e.target.parentElement;
            var card = button.parentElement.parentElement;
            var coupleNo = card.id.substring(6);
            window.open("./editCouple.html?id=" + coupleNo, "_self");
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
    console.log(data);
    return data;
}

// Removes a couple from local storage
function removeCouple(coupleNo) {
    var localStorage = window.localStorage;
    delete localStorage[coupleNo];
    location.reload();
}