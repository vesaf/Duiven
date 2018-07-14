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

document.addEventListener("DOMContentLoaded", function () {
    var data = loadData();
    var listContent = "";
    console.log(Object.keys(data["couples"]));
    for (let i = 0; i < Object.keys(data["couples"]).length; i++) {
        var couple = data["couples"][Object.keys(data["couples"])[i]];
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
        listContent += `
            <li class="card" id="couple` + i + `">
                <div class="listItem">
                    <p class="coupleName">` + couple.maleName + ` & ` + couple.femaleName + `</p>
                    <table>
                        <tr>
                            <td class="date1Label"> Legdatum eerste ei: ` + formatDate(date1) + `</td>
                            <td>` + 
                                date1Icon + `
                            </td>
                            <td class="date2Label"> Legdatum tweede ei: ` + formatDate(date2) + `</td>
                            <td>` +
                                date2Icon + `
                            </td>
                        </tr>
                        <tr>
                            <td class="date3Label"> Uitkomst datum: ` + formatDate(date3) + `</td>
                            <td>` +
                                date3Icon + `
                            </td>
                            <td class="date4Label"> Ringdatum: ` + formatDate(date4) + `</td>
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
	
	var addButton = document.getElementById("addButton");
	console.log(addButton);
	document.addEventListener("click", function (e) {
		if (isHeaderButton(e.target) || isHeaderButton(e.target.parentElement)) window.open("./addCouple.html", "_self");
	});
}, false);

function addDays(date = new Date(), days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date = new Date()) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${day}/${month}/${year}`;
} 

function isHeaderButton (element) {
	return (element.classList.contains("header-button"));
}

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