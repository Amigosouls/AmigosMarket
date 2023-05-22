// 
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
                        <h5>Trading Balance:${value['asset']}</h5>
                        <button class="dropbtn"><ion-icon name="person-add-outline"></ion-icon>${value['uname']}</button>
                        <div class="dropdown-content">
                        <a href="#">Link 1</a>
                        <a href="#">Link 2</a>
                        <a href="#">Link 3</a>
                        </div>
                  `)
                    successAlertBox(`Login Success....! User Logged in as ${value["uname"]}`, "success");
                }
            }

        }

    }

})

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
                tdata += '<td><button type=button class="btn btn-warning" onclick="buyProducts(' + object["id"] + ')"><ion-icon name="checkmark-circle-outline" size="normal"></ion-icon>Get</button></td>'
                tdata += '</tr>'
            }

        }
        document.getElementById("prod_list").innerHTML = tdata;
    }
    tradingTable();
}

showProducts();

function buyProducts(pro_id) {
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            console.log(jsonData);
            for (const value of jsonData) {
                if (value['logged'] == 1) {
                    console.log(value);
                    const xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", `http://localhost:3000/Market_Products/${pro_id}`);
                    xmlHttp.send();
                    xmlHttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const productData = JSON.parse(this.responseText);
                            console.log(productData);
                            const xmlHttpMarket = new XMLHttpRequest();
                            xmlHttpMarket.open("POST", "http://localhost:3000/User_products");
                            xmlHttpMarket.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            xmlHttpMarket.send(
                                JSON.stringify(
                                    {
                                        user_id:value['id'],
                                        user_name:value['uname'],
                                        pro_id:productData['id'],
                                        product_name:productData['product_name'],
                                        product_type:productData['product_type'],
                                        product_price:productData['product_price']
                                    }
                                )
                            );
                        }
                    }
                }
            }
        }
    }
}

function tradingTable(){
    const xmlParser = new XMLHttpRequest();
    xmlParser.open("GET", "http://localhost:3000/Users");
    xmlParser.send();
    xmlParser.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const jsonData = JSON.parse(this.responseText);
            for (const value of jsonData) {
                console.log(value);
                if (value['logged'] == 1) {
                    const xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", `http://localhost:3000/User_products`);
                    xmlHttp.send();
                    xmlHttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            const productData = JSON.parse(this.responseText);
                            var tdata =""; 
                            for (const products of productData) {
                                if(value['id']==products['user_id']){
                                    tdata+=`<tr>
                                    <td>${products["id"]}</td>
                                    <td>${products["product_name"]}</td>
                                    <td>${products["product_type"]}</td>
                                    <td>${products["product_price"]}</td>
                                    <td><button>Sell</button></td></tr>`
                                }
                                
                            }
                            if(tdata==''){
                                tdata='<td colspan=5>No items Available</td>'
                            }
                            else{
                            document.getElementById('myprod_list').innerHTML=tdata;
                            }
                        }
                    }
                    break;
                }
                
            }
        }
    }
}