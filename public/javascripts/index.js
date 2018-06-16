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
    var listContent = "";
    console.log(Object.keys(data["couples"]));
    for (let i = 0; i < Object.keys(data["couples"]).length; i++) {
        var couple = data["couples"][Object.keys(data["couples"])[i]];
        listContent += "<li class='card' id='couple' " + i + "><div class='listItem'>" + 
            "<p class='coupleName'>" + couple.name + "</p><table><tr>" + 
            "<td class='date1Label'> Legdatum eerste ei: " + formatDate(couple.date1) + "</td>" + 
            "<td class='date2Label'> Legdatum tweede ei: " + formatDate(addDays(couple.date1, 2)) + "</td></tr>" + 
            "<tr><td class='date3Label'> Uitkomst datum: " + formatDate(addDays(couple.date1, 18)) + "</td>" + 
            "<td class='date4Label'> Ringdatum: " + formatDate(addDays(couple.date1, 25)) + "</td></tr>" + 
            "</table></div></li>";
    }
    var list = document.getElementById("mainList");
    list.innerHTML = listContent;
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