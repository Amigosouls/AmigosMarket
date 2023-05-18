
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


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alertBox = (msg) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-success alert-dismissible" role="alert">`,
        `<h3>${msg}</h3>`,
        `<button type="button" class="btn btn-secondary form-btn" data-bs-dismiss="alert" aria-label="Close">Cancel</button>`,
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

// import { restClient } from '/node_modules/@polygon.io/client-js'
// const rest = restClient("sF98gBtWzFtPZwy_lDORd2RSb4s08cIq");

// rest.stocks.aggregates("AAPL", 1, "day", "2023-01-01", "2023-04-14").then((data) => {
// 	console.log(data);
// }).catch(e => {
// 	console.error('An error happened:', e);
// });

// console.log(aggregates)



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
    alertBox("Account Create Successfully");
}




$(document).ready(function(){
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
                for(let value of jsonData)
                {
                    if(givenName==value['uname']||givenName=="")
                    {
                        $("#unameFeedback").text("UserName is Already Occupied");
                    }
                    else{
                        $("#unameFeedback").text("UserName is Unique");
                    }
                }
            }
        }
    })
  });

  function getStockValue(){
    fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=sF98gBtWzFtPZwy_lDORd2RSb4s08cIq`,{method:"GET"  //api link from pixaby
    }).then(res => res.json())
    .then(stock=>{
        console.log(stock.ticker)
        console.log(stock.results[0])
        
    })
}
getStockValue()


