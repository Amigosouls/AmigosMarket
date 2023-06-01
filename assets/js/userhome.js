var key = "abczxy123098AmigoMarket"
// alert boxes
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



//function to update the navigation menu upon login and welcome the user
$(document).ready(function () {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (const value of jsonData) {
                if (value['logged'] == 1) {
                    $("#loginMenu").empty();
                    $("#loginMenu").html(`
                        <h5 id="showAmount">Trading Balance : $ ${value['asset']}</h5>
                        <div class='dropdown'>
                        <button class="dropbtn dropdown-toggle"><ion-icon name="person-add-outline"></ion-icon>${value['uname']}</button>
                        <div class="dropdown-content">
                        <button class='btn position-relative mt-3' onclick="showNotification()" id="noti"><ion-icon name="mail-unread-outline"></ion-icon>Notification<span  id="notiCount" class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-danger"><span class="visually-hidden">unread messages</span</span></button>
                        <button class='btn' data-bs-toggle="modal" data-bs-target="#editModal" onclick="editProfile(${value['id']})"><ion-icon name="people-circle-outline"></ion-icon> Edit Profile</button>
                        <button class="btn" onclick="userLogout(${value['id']})"><ion-icon name="walk-outline"></ion-icon>Logout</button>
                        </div>
                        </div>
                  `)
                    successAlertBox(`Login Success....! User Logged in as ${value["uname"]}`, "success");
                }
            }
        }
    }

})

//function edits the user profile  
function editProfile(id) {
    const xmlObj = new XMLHttpRequest();
    xmlObj.open("GET", `http://localhost:3000/Users/${id}`);
    xmlObj.send();
    xmlObj.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            document.getElementById('uid').value = jsonData['id'];
            document.getElementById('fname').value = jsonData['fname'];
            document.getElementById('lname').value = jsonData['lname'];
            document.getElementById('uname').value = jsonData['uname'];
            document.getElementById('asset').value = jsonData['asset'];
        }
    }
}
$(document).ready(function () {
    var givenName = document.getElementById('uname').value;
    $("#uname").on("click keypress keyup keydown", function () {
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

function editConfirm(id, asset) {

    const xmlParser = new XMLHttpRequest();
    xmlParser.open("PUT", `http://localhost:3000/Users/${id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const userName = document.getElementById('uname').value;
    const password = document.getElementById('cpass').value;
    xmlParser.send(
        JSON.stringify(
            {
                fname: firstName,
                lname: lastName,
                uname: userName,
                password: `${CryptoJS.AES.encrypt(password, key)}`,
                logged: 1,
                asset: asset
            }
        )
    );
    successAlertBox("Profile Edited Successfully", "success");
}


var data = " ";
var count = 0
data = $("#home").html()
function showNotification() {
    $(document).ready(function () {
        if ($("#home-tab").text() == 'View market') {
            const xmlObj = new XMLHttpRequest();
            xmlObj.open("GET", `http://localhost:3000/Notifications`);
            xmlObj.send();
            var noti = ""
            xmlObj.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const jsonData = JSON.parse(this.responseText)
                    const xmlParser = new XMLHttpRequest();
                    xmlParser.open("GET", "http://localhost:3000/Users");
                    xmlParser.send();
                    xmlParser.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const users = JSON.parse(this.responseText);
                            for (const value of users) {
                                if (value['logged'] == 1) {
                                    count = 0
                                    for (const notification of jsonData) {
                                        if (notification['uid'] == value['id']) {
                                            count++
                                            noti += `<div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                            <div class="alert alert-${notification['type']} alert-dismissible" role="alert">
                                                 <div>${notification['message']}</div>
                                                <button type="button" class="btn-close" onclick="clearNotification(${notification['id']})" data-bs-dismiss="alert" aria-label="Close"></button>
                                                </div> </div>`
                                        }
                                    }
                                    if (noti == "") {
                                        noti = "<h5>No notifications Available</h5>"
                                    }
                                    $("#show-noti").html(noti);
                                    break;
                                }
                            }
                        }
                    }

                }
            }
            $('.products').hide();
            $('#noti').html(`<ion-icon name="rocket-outline"></ion-icon>View market`)
            $('#home').show()
            $("#home-tab").text("Notification")

        }
        else {
            $('#home').show();
            $('#home').html(data)
            $("#home-tab").text("View market")
            showProducts()
            $('#noti').html(`<ion-icon name="mail-unread-outline"></ion-icon>Notification<span id="notiCount" class="position-absolute top-0 start-80 translate-middle badge rounded-pill bg-danger">${count > 10 ? "10+" : count}</span>`)
        }
    });
}

$(document).ready(function () {
    $('#profile-tab').click(function () {
        $('#show-noti').hide();
        $('.products').hide();
    })
})
$(document).ready(function () {
    $('#contact-tab').click(function () {
        $('#show-noti').hide();
        $('.products').hide();
    })
})
$(document).ready(function () {
    $('#home-tab').click(function () {
        $('#show-noti').show();
        if ($("#home-tab").text() == 'View market') {
            $(".products").show();
        }
    })
})

function createNotification(message, type, uid) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("POST", `http://localhost:3000/Notifications`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                message: message,
                type: type,
                uid: uid
            }
        )
    );
}

//the following fuction updates market product values periodically

// var count = 0;
// setInterval(function () {
//     const pro_id = [1, 2, 3, 4, 5];
//     updateProductPrice(pro_id[count])
//     if (count == 4) {
//         count = 0;
//     }
//     count++;
//     showProducts();
// }, 5000)

//update market products price
// function updateProductPrice(pro_id) {
//     const xmlObj = new XMLHttpRequest();
//     xmlObj.open("GET", `http://localhost:3000/Market_Products/${pro_id}`);
//     xmlObj.send();
//     xmlObj.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             const jsonData = JSON.parse(this.responseText);
//             const xmlParser = new XMLHttpRequest();
//             xmlParser.open("PUT", `http://localhost:3000/Market_products/${pro_id}`)
//             xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//             xmlParser.send(
//                 JSON.stringify(
//                     {
//                         product_name: jsonData['product_name'],
//                         product_type: jsonData['product_type'],
//                         product_price: parseInt(Math.random() * 1500)
//                     })
//             )
//         }
//     }

// }

//clear notifications in user notification tab
function clearNotification(req_id) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/Notifications/${req_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: req_id
            }
        )
    )
}


//function to show the products available in the market

function showProducts() {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Market_Products");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            var tdata = "";

            for (const object of jsonData) {
                tdata += '<tr>';
                tdata += '<td>' + object["id"] + '</td>';
                tdata += '<td>' + object["product_name"] + '</td>';
                tdata += '<td>' + object["product_type"] + '</td>';
                tdata += '<td>' + object["product_price"] + '</td>';
                tdata += `<td><button type=button class="btn btn-warning"  onclick="buyProducts(${object["id"]},'new','${''}')"><ion-icon name="checkmark-circle-outline" size="normal"></ion-icon>Get</button></td>`
                tdata += '</tr>'
            }
            if (tdata == '') {
                tdata = "<td colspan='5'><tr>No Products are available</td></tr>";
            }

        }
        document.getElementById("prod_list").innerHTML = tdata;
    }
    tradingTable();
}

showProducts();

function buyProducts(...args) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (const value of jsonData) {
                if (value['logged'] == 1) {
                    const xmlObj = new XMLHttpRequest();
                    xmlObj.open("GET", `http://localhost:3000/Market_Products/${args[0]}`);
                    xmlObj.send();
                    xmlObj.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const product = JSON.parse(this.responseText);
                            const date = new Date();
                            if (args[1] == 'new') {
                                if (value['asset'] < product['product_price']) {
                                    successAlertBox(`Insufficient Trading balance, Available:${value['asset']} <br><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loanModal" onclick=loanEligiblity()>Get Loan</button>`, 'danger');
                                    return (0);
                                }
                                updateAmount(value['id'], product['id'], '-')
                                createNotification(`Date:${date.toLocaleDateString()}-${date.toLocaleTimeString()} <br>Bought ${product['product_name']} for ${product['product_price']}`, "success", value['id'])
                                successAlertBox(`Brought product:${product['product_name']} for price:${product['product_price']} `, 'success')
                            }
                            const xmlHttp = new XMLHttpRequest();
                            xmlHttp.open("POST", "http://localhost:3000/User_products");
                            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            xmlHttp.send(
                                JSON.stringify(
                                    {
                                        user_id: args[2] == '' ? value['id'] : args[2],
                                        pro_id: product['id'],
                                        user_name: value['user_name'],
                                        product_name: product['product_name'],
                                        product_type: product['product_type'],
                                        product_price: product['product_price']
                                    }
                                )
                            );
                            tradingTable();
                        }
                    }
                }
            }

        }
    }
}


//function to update data in json file and trading amount

function updateAmount(user_id, pro_id, oper) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", `http://localhost:3000/Users/${user_id}`);
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", `http://localhost:3000/Market_Products/${pro_id}`);
            xmlHttp.send();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const productData = JSON.parse(this.responseText);
                    const userXmlObj = new XMLHttpRequest();
                    const date = new Date();
                    userXmlObj.open("PUT", `http://localhost:3000/Users/${user_id}`);
                    userXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    if (oper == "+") {
                        userXmlObj.send(
                            JSON.stringify(
                                {
                                    fname: jsonData['fname'],
                                    lname: jsonData['lname'],
                                    uname: jsonData['uname'],
                                    password: jsonData['password'],
                                    asset: jsonData['asset'] + productData['product_price'],
                                    logged: 1
                                }
                            )
                        );
                        createNotification(`Date:${date.toLocaleDateString()}-${date.toLocaleTimeString()} <br> Acount credited for $ ${productData['product_price']}`, "success", user_id);
                        $('#showAmount').text(`Trading Amount:${jsonData['asset'] + productData['product_price']}`);
                    }
                    else if (oper == "-") {
                        userXmlObj.send(
                            JSON.stringify(
                                {
                                    fname: jsonData['fname'],
                                    lname: jsonData['lname'],
                                    uname: jsonData['uname'],
                                    password: jsonData['password'],
                                    asset: jsonData['asset'] - productData['product_price'],
                                    logged: 1
                                }
                            )
                        );
                        createNotification(`Date:${date.toLocaleDateString()}-${date.toLocaleTimeString()}<br> Acount debited for $ ${productData['product_price']}`, "warning", user_id);
                        $('#showAmount').text(`Trading Amount:${jsonData['asset'] - productData['product_price']}`);
                    }
                }

            }
        }
    }
}

//following function will update the table of my Items

function tradingTable() {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (const value of jsonData) {
                if (value['logged'] == 1) {
                    const xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", `http://localhost:3000/User_products`);
                    xmlHttp.send();
                    xmlHttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const productData = JSON.parse(this.responseText);
                            var tdata = "";
                            for (const products of productData) {
                                if (value['id'] == products['user_id']) {
                                    tdata += `<tr>
                                    <td>${products["id"]}</td>
                                    <td>${products["product_name"]}</td>
                                    <td>${products["product_type"]}</td>
                                    <td>${products["product_price"]}</td>
                                    <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#giveUsers" onclick="generateUsers(${products['id']})">Sell Item</button></td></tr>`
                                }

                            }
                            if (tdata == '') {
                                tdata = '<td colspan=5>No items Available</td>'
                            }
                            document.getElementById('myprod_list').innerHTML = tdata;
                        }
                    }
                    break;
                }

            }
        }
    }
}
tradingTable()

//function updates the request table details

function showRequest() {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", `http://localhost:3000/Request`);
            xmlHttp.send();
            xmlHttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const productData = JSON.parse(this.responseText);
                    var requestString = "";
                    for (let values of jsonData) {
                        if (values['logged'] == 1) {

                            for (const product of productData) {
                                if (values['id'] == product['request_to_user']) {
                                    requestString += `<tr>
                                    <td>${product['request_user_id']}
                                    <td>${product['product_name']}</td>
                                    <td>${product['product_type']}</td>
                                    <td>${product['product_price']}</td>
                                    <td><button class="btn btn-success" onclick="acceptRequest(${product['pro_id']},${product['id']},${product['request_user_id']})">Accept</button></td>
                                    <td><button class="btn btn-danger" onclick="declineRequest(${product['pro_id']},${product['id']},${product['request_user_id']})">Decline</button></td>
                                    </tr>`
                                }
                            }
                            if (requestString == "") {
                                requestString = `<tr><td colspan=5>No request Available</td></tr>`
                            }
                            document.getElementById('request_list').innerHTML = requestString;
                            break;
                        }

                    }
                }
            }
        }
    }
}

function declineRequest(pro_id, req_id, req_uid) {
    buyProducts(pro_id, 'old', req_uid)
    updateAmount(req_id, pro_id, "+")
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/Request/${req_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: req_id
            })
    )
    successAlertBox(`Delined request of User:${req_uid}`, "danger")
    showRequest();
}
function acceptRequest(pro_id, req_id, req_to_uid) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/Request/${req_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: req_id
            }
        )
    )
    createNotification(`Accepted request ID:${req_id}`, 'primary', req_to_uid)
    buyProducts(pro_id, 'new', '');
    updateAmount(req_to_uid, pro_id, '+')
    showRequest();
    tradingTable();
}

showRequest()
//generate User list upon selling
function generateUsers(pro_id) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            var users = ""
            for (const value of jsonData) {
                users += `<tr>
                <td>${value['uname']}</td>
                <td><button onclick="sendRequest(${pro_id},${value["id"]})" data-bs-dismiss="modal">Request</button></td>
                </tr>`
            }
            $('#sendRequest').html(users);
        }
    }
}

//send request to users available in market

function sendRequest(pro_id, user_id) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `http://localhost:3000/User_products/${pro_id}`);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const productData = JSON.parse(this.responseText);
            const requestXmlObj = new XMLHttpRequest();
            requestXmlObj.open("POST", `http://localhost:3000/Request`);
            requestXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            requestXmlObj.send(
                JSON.stringify(
                    {

                        request_to_user: user_id,
                        request_user_id: productData['user_id'],
                        user_name: productData['user_name'],
                        pro_id: productData['pro_id'],
                        product_name: productData['product_name'],
                        product_type: productData['product_type'],
                        product_price: productData['product_price']
                    }
                )
            );
            const date = new Date()
            createNotification(`Date:${date.toLocaleDateString()}-${date.toLocaleTimeString()} <br> Requested to sell ${productData['product_name']} send to UserID:${user_id}`, "success", productData['user_id'])
            successAlertBox(`Request Send to User ID:${user_id}`, 'success')
        }

    }

    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/User_products/${pro_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: pro_id

            }
        )
    )
    tradingTable();


}





//function to logout the user from the session and redirect to home
function userLogout(user_id) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", `http://localhost:3000/Users/${user_id}`);
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const values = JSON.parse(this.responseText);
            const userXmlObj = new XMLHttpRequest();
            userXmlObj.open("PUT", `http://localhost:3000/Users/${user_id}`);
            userXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            userXmlObj.send(
                JSON.stringify(
                    {
                        fname: values['fname'],
                        lname: values['lname'],
                        uname: values['uname'],
                        password: values['password'],
                        asset: values['asset'],
                        logged: 0
                    }
                )
            );
        }
    }
    setTimeout(logOut, 3000);
    $(".progress").attr("hidden", false)
    $("#progressBar").animate({ width: '100%' }, 2000);
    function logOut() {
        window.location.replace("index.html")
    }
}

var user_total = 0;
function loanEligiblity() {
    $(document).ready(function () {
        const xmlParser = new XMLHttpRequest();
        xmlParser.open("GET", "http://localhost:3000/Users");
        xmlParser.send();
        xmlParser.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const jsonData = JSON.parse(this.responseText);
                for (const value of jsonData) {
                    if (value['logged'] == 1) {
                        const xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("GET", `http://localhost:3000/User_products`);
                        xmlHttp.send();
                        xmlHttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                user_total = 0;
                                const productData = JSON.parse(this.responseText);
                                for (const product of productData) {
                                    if (product['user_id'] == value['id']) {
                                        user_total += parseInt(product['product_price']);
                                    }
                                }
                                if (user_total == 0) {
                                    console.log("hi")
                                    $('#LoanForm').remove(".modal-body")
                                    $("#LoanForm").html(`<div class="modal-body">
                                    </div><h5>Sorry! We can't provide you loan</h5>
                                    <h3>Your Total Asset: ${user_total}</h3>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`)
                                }
                                else {
                                    var today = new Date();
                                    var deadline = new Date()
                                    $("#duration").on("click", function () {
                                        if ($("#duration").val() == 10) {
                                            $("#int_amt").val("5")
                                            deadline.setDate(today.getDate() + 10)
                                           $("#deadline").val(`${deadline.toLocaleDateString()}`)
                                        }
                                        else if ($("#duration").val() == 15) {
                                            $("#int_amt").val("8")
                                            deadline.setDate(today.getDate() + 15)
                                            $("#deadline").val(`${deadline.toLocaleDateString()}`)
                                        }
                                        else if ($("#duration").val() == 25) {
                                            $("#int_amt").val("12")
                                            deadline.setDate(today.getDate() + 25)
                                            $("#deadline").val(`${deadline.toLocaleDateString()}`)
                                        }
                                        else if ($("#duration").val() == 30) {
                                            $("#int_amt").val("15")
                                            deadline.setDate(today.getDate() + 30)
                                            $("#deadline").val(`${deadline.toLocaleDateString()}`)
                                        }
                                    })
                                    $("#loan-desc").text(`You are eligible for Loan Amount:${user_total / 2}`);
                                    $("#total_loan").prop("max", `${user_total/2}`)
                                    $("#total_loan").val(user_total/2);
                                    $("#total_loan").on("click keypress blur",function(){
                                        var amount = user_total/2;
                                        var rate =$("#int_amt").val();
                                        var day = $("#duration").val();
                                        var simp_interest = amount*day*(rate/100)*(1/365);
                                        $("#tot-int").val(simp_interest);
                                        $("#total-loan").text(`You have to pay back ${parseInt(amount+simp_interest)} by ${deadline.toLocaleDateString()}`)
                                    })
                                   // var simp_interest =
                                }
                                
                            }
                        }
                        break;
                    }

                }
            }
        }
    }
    )
}

console.log()