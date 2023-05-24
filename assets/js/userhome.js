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
                        <h5 id="showAmount">Trading Balance:${value['asset']}</h5>
                        <div class='dropdown'>
                        <button class="dropbtn"><ion-icon name="person-add-outline"></ion-icon>${value['uname']}</button>
                        <div class="dropdown-content">
                        <button class='btn'>Link 1</button>
                        <button class='btn'>Link 2</button>
                        <button class="btn" onclick="userLogout(${value['id']})">Logout</button>
                        </div>
                        </div>
                  `)
                    successAlertBox(`Login Success....! User Logged in as ${value["uname"]}`, "success");
                }
            }

        }

    }

})

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
                tdata += `<td><button type=button class="btn btn-warning"  onclick="buyProducts(${object["id"]},'new')"><ion-icon name="checkmark-circle-outline" size="normal"></ion-icon>Get</button></td>`
                tdata += '</tr>'
            }

        }
        document.getElementById("prod_list").innerHTML = tdata;
    }
    tradingTable();
}

showProducts();

function buyProducts(pro_id,type) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (const value of jsonData) {
                if (value['logged'] == 1) {
                    const xmlObj = new XMLHttpRequest();
                    xmlObj.open("GET", `http://localhost:3000/Market_Products/${pro_id}`);
                    xmlObj.send();
                    xmlObj.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const product = JSON.parse(this.responseText);
                            const xmlHttp = new XMLHttpRequest();
                            xmlHttp.open("POST", "http://localhost:3000/User_products");
                            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            xmlHttp.send(
                                JSON.stringify(
                                    {
                                        user_id: value['id'],
                                        user_name: value['uname'],
                                        pro_id: product['id'],
                                        product_name: product['product_name'],
                                        product_type: product['product_type'],
                                        product_price: product['product_price']
                                    }
                                )
                            );
                            if(type=='new')
                            {
                                updateAmount(value['id'], product['id'], '-')
                            }
                           
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
                    userXmlObj.open("PUT", `http://localhost:3000/Users/${user_id}`);
                    userXmlObj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    if (oper == "+") {
                        userXmlObj.send(
                            JSON.stringify(
                                {
                                    fname: jsonData['fanme'],
                                    lname: jsonData['lname'],
                                    uname: jsonData['uname'],
                                    password: jsonData['password'],
                                    asset: jsonData['asset'] + productData['product_price'],
                                    logged: 1
                                }
                            )
                        );
                        $('#showAmount').text(`Trading Amount:${jsonData['asset'] + productData['product_price']}`);
                    }
                    else if (oper == "-") {
                        userXmlObj.send(
                            JSON.stringify(
                                {
                                    fname: jsonData['fanme'],
                                    lname: jsonData['lname'],
                                    uname: jsonData['uname'],
                                    password: jsonData['password'],
                                    asset: jsonData['asset'] - productData['product_price'],
                                    logged: 1
                                }
                            )
                        );
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
                            else {
                                document.getElementById('myprod_list').innerHTML = tdata;
                            }
                        }
                    }
                    break;
                }

            }
        }
    }
}
tradingTable()

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
                                    <td>${product['user_name']}</td>
                                    <td>${product['product_name']}</td>
                                    <td>${product['product_type']}</td>
                                    <td>${product['product_price']}</td>
                                    <td><button class="btn btn-success" onclick="acceptRequest(${product['pro_id']},'${product['product_name']}',${product['product_price']})">Accept</button></td>
                                    <td><button class="btn btn-danger" onclick="declineRequest(${product['id']})">Decline</button></td>
                                    </tr>`
                                }
                            }
                            if (requestString == "") {
                                requestString = `<tr><td colspan=6>No request Available</td></tr>`
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

function declineRequest(pro_id) {
    buyProducts(pro_id,'old')
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/Request/${pro_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: pro_id

            })
    )
    showRequest();
}

function acceptRequest(pro_id, pro_name, price) {
    buyProducts(pro_id);
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("DELETE", `http://localhost:3000/Request/${pro_id}`);
    xmlParser.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlParser.send(
        JSON.stringify(
            {
                id: pro_id

            }
        )
    )
    successAlertBox(`Product Bought!  Name:${pro_name} Price:${price}`, 'success');
    showRequest();
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
            successAlertBox(`Request Send to User ID:${productData['user_name']}`,'success')
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
            window.location.replace("index.html")
        }
    }


}