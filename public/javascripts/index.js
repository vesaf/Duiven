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
        listContent += "<li class='card' id='couple' " + i + "><div class='listItem'>" + 
            "<p class='coupleName'>" + couple.maleName + " & " + couple.femaleName + "</p><table><tr>" + 
            "<td class='date1Label'> Legdatum eerste ei: " + formatDate(couple.date1) + "</td>" + 
			"<td><i class='fa fa-check'></i></td>" +
            "<td class='date2Label'> Legdatum tweede ei: " + formatDate(addDays(couple.date1, 2)) + "</td></tr>" +
            "<tr><td class='date3Label'> Uitkomst datum: " + formatDate(addDays(couple.date1, 18)) + "</td>" + 
            "<td class='date4Label'> Ringdatum: " + formatDate(addDays(couple.date1, 25)) + "</td></tr>" + 
            "</table></div></li>";
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