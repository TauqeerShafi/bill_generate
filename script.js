/* JavaScript File: script.js */
let products = [];

function addProduct() {
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let stock = document.getElementById("productStock").value;
    
    if (name && price && stock) {
        let product = { name, price, stock };
        products.push(product);
        updateProductList();
        updateProductDropdown();
    }
}

function updateProductList() {
    let list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach((p, index) => {
        list.innerHTML += `<li>${p.name} - $${p.price} (Stock: ${p.stock})</li>`;
    });
}

function updateProductDropdown() {
    let dropdown = document.getElementById("selectProduct");
    dropdown.innerHTML = "";
    products.forEach((p, index) => {
        dropdown.innerHTML += `<option value='${index}'>${p.name}</option>`;
    });
}

function addToCart() {
    let productIndex = document.getElementById("selectProduct").value;
    let quantity = document.getElementById("quantity").value;
    
    if (productIndex !== "" && quantity > 0) {
        let product = products[productIndex];
        if (quantity <= product.stock) {
            let cartList = document.getElementById("cartList");
            cartList.innerHTML += `<li>${product.name} x${quantity} - $${product.price * quantity}</li>`;
            product.stock -= quantity;
            updateProductList();
        } else {
            alert("Not enough stock available!");
        }
    }
}

function generateBill() {
    alert("Bill Generated!");
}
