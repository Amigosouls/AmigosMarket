var key ="abczxy123098AmigoMarket"
//function shows alert box for successful actions
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

//function shows alert box for unsuccessful actions
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


//function for creating new user
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
                password: `${CryptoJS.AES.encrypt(password,key)}`,
                logged: 0,
                loanApplied : 0,
                asset: 5000
            }
        )
    );
    successAlertBox("Account Created Successfully", "success");
}

// function for validating users while log in
function userLogin() {
    const userName = document.getElementById('log_uname').value;
    const userpass = document.getElementById('log_pass').value;
    const xmlParser = new XMLHttpRequest();
    var login=false;
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (let values of jsonData) {
                var decryptPass = CryptoJS.AES.decrypt(values['password'], key)
                if (userName == values['uname'] && userpass == decryptPass.toString(CryptoJS.enc.Utf8)) {
                    const userXmlObj = new XMLHttpRequest();
                    userXmlObj.open("PUT", `http://localhost:3000/Users/${values['id']}`);
                    userXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    userXmlObj.send(
                        JSON.stringify(
                            {
                                fname: values['fname'],
                                lname: values['lname'],
                                uname: values['uname'],
                                password: values['password'],
                                asset: values['asset'],
                                logged: 1
                            }
                        )
                    );
                    login=true;
                    $(".progress").attr("hidden",false)
                    $("#progressBar").animate({width:'100%'},2000);
                    setTimeout(logIn,3000);
                    break;
                }

            }
            if(!login){
                errorAlertBox("UserName or password is incorect, Try Again! ","danger")
            }
            
        }
    }
   
}
function logIn(){
    window.location.replace("userhome.html")
}

$(document).ready(function () {
    var givenName = document.getElementById('uname').value;
    $("#fname").on("click keypress keyup keydown", function (){
        $('#uname').val(document.getElementById('fname').value+document.getElementById('lname').value);
    })
    $("#lname").on("click keypress keyup keydown", function (){
        $('#uname').val(document.getElementById('fname').value+document.getElementById('lname').value);
    })
    $("#uname").on("click keypress keyup keydown", function () {
        const xmlParser = new XMLHttpRequest();
        givenName = document.getElementById('uname').value;
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

setInterval(function () {

    const comp_list = ["A", "AA", "AAC", "AACI", "AADI", "AADI", "AAIC", "AAL", "AAL", "AAN", "AAPL", "ABC", "ABG"];
    getStockValue(comp_list[count]);
    if (count == 12) {
        count = 0;
    }
}, 15000);

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

function collectFeedbacks() {
    const user_name = document.getElementById("cust_name").value;
    const message = document.getElementById("cust_feedback").value;
    const requestXmlObj = new XMLHttpRequest();
    requestXmlObj.open("POST", `http://localhost:3000/Feedbacks`);
    requestXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    requestXmlObj.send(
        JSON.stringify(
            {
                user_name: user_name,
                message: message,
                user_img: "https://xsgames.co/randomusers/avatar.php?g=pixel"
            }
        )
    );
    showReviews();
}

function showReviews(){
    $(document).ready(function () {
        const xmlObj = new XMLHttpRequest();
        xmlObj.open("GET", "http://localhost:3000/Feedbacks");
        xmlObj.send();
        xmlObj.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var reviewString = ""
                const user_review = JSON.parse(this.responseText);
                for (const review of user_review) {
                    reviewString +=`<div class="card" style="width: 18rem;">
                    <img src="${review['user_img']}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5>${review['user_name']}</h5>
                      <p class="card-text">${review['message']}</p>
                    </div>
                  </div>`
                }
                $("#customer_feedbacks").html(reviewString);
            }
        }
    })
}
showReviews()

$("#reviewbtn").click(function(){
    $("#userReviews").slideToggle();
})