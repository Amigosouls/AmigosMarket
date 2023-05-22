const successAlert = document.getElementById("successAlertBox");
const successAlertBox = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    successAlert.append(wrapper);
}

const errorAlert = document.getElementById("errorAlertBox");
const errorAlertBox = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    errorAlert.append(wrapper);
}


//prevents users from submitting from with errors


(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()



function signUpUser() {
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const userName = document.getElementById('uname').value;
    const password = document.getElementById('cpass').value;

    const xmlParser = new XMLHttpRequest();
    xmlParser.open("POST", "http://localhost:3000/Users");
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                fname: firstName,
                lname: lastName,
                uname: userName,
                password: password
            }
        )
    );
    successAlert("Account Create Successfully", "success");
}

function userLogin() {
    const userName = document.getElementById('log_uname').value;
    const userpass = document.getElementById('log_pass').value;
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (let values of jsonData) {
                if (userName == values['uname'] && userpass == values['password']) {
                    const userXmlObj = new XMLHttpRequest();
                    userXmlObj.open("POST", "http://localhost:3000/Users");
                    userXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    userXmlObj.send(
                        JSON.stringify(
                            {
                                logged: 1
                            }
                        )
                    );
                    window.location.replace("userhome.html")
                }

            }
            errorAlertBox("Login Failed", "danger")
        }
    }

}
$(document).ready(function () {
    var givenName = document.getElementById('uname').value;
    $("#uname").on("click keypress", function () {
        const xmlParser = new XMLHttpRequest();
        givenName = document.getElementById('uname').value;
        console.log(givenName);
        xmlParser.open("GET", "http://localhost:3000/Users");
        xmlParser.send();
        xmlParser.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const jsonData = JSON.parse(this.responseText);
                for (let value of jsonData) {
                    if (givenName == value['uname'] || givenName == "") {
                        $("#unameFeedback").text("UserName is Already Occupied");
                        break;
                    }
                    else {
                        $("#unameFeedback").text("UserName is Unique");
                    }
                }
            }
        }
    })
});
var count = 0;

//function to update stock market shares

//   setInterval(function(){

//     const comp_list =["A","AA","AAC","AACI","AADI","AADI","AAIC","AAL","AAL","AAN","AAPL","ABC","ABG"];
//     getStockValue(comp_list[count]);    
//         if(count==12){
//             count=0;
//         }
//   },15000);

function getStockValue(comp_name) {
    var stock_string = ""
    stock_string += `<p>`
    count += 1;
    fetch(`https://api.polygon.io/v2/aggs/ticker/${comp_name}/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sF98gBtWzFtPZwy_lDORd2RSb4s08cIq`, {
        method: "GET"  //api link from pixaby
    }).then(res => res.json())
        .then(stock => {
            stock_string += `<h5> Company Name:${stock.ticker}</h5>`;
            stock_string += `<h5> Close Price:${stock.results[0].c}</h5>`;
            stock_string += `<h5> Highest Price:${stock.results[0].h}</h5>`;
            stock_string += `<h5> Lowest Price Price:${stock.results[0].l}</h5>`;
            stock_string += `<h5> Number of transactions:${stock.results[0].n}</h5>`;
            stock_string += `<h5>Trading Volume:${stock.results[0].v}</h5>`;
            stock_string += `</p>`
            $(".marketNews").html(stock_string);
        })

}

