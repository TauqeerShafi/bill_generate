let products = JSON.parse(localStorage.getItem('products')) || [];
let cart = [];
let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

function addProduct() {
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let image = document.getElementById("productImage").files[0];

    if (name && price && image) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let product = { name, price, image: e.target.result };
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            updateProductList();
            updateProductDropdown();
        };
        reader.readAsDataURL(image);
    } else {
        alert("প্রোডাক্টের নাম, দাম এবং ছবি অবশ্যই দিতে হবে!");
    }
}

function updateProductList() {
    let list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach((p, index) => {
        list.innerHTML += `<li><img src="${p.image}" alt="${p.name}" width="50"> ${p.name} - ${p.price} টাকা <button onclick="editProduct(${index})">এডিট</button></li>`;
    });
}

function updateProductDropdown() {
    let dropdown = document.getElementById("selectProduct");
    dropdown.innerHTML = "";
    products.forEach((p, index) => {
        dropdown.innerHTML += `<option value='${index}'>${p.name}</option>`;
    });
}

function searchProduct() {
    let searchTerm = document.getElementById("searchProduct").value.toLowerCase();
    let filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    let list = document.getElementById("productList");
    list.innerHTML = "";
    filteredProducts.forEach((p, index) => {
        list.innerHTML += `<li><img src="${p.image}" alt="${p.name}" width="50"> ${p.name} - ${p.price} টাকা <button onclick="editProduct(${index})">এডিট</button></li>`;
    });
}

function editProduct(index) {
    let newPrice = prompt("নতুন দাম লিখুন:");
    if (newPrice !== null && !isNaN(newPrice)) {
        products[index].price = newPrice;
        localStorage.setItem('products', JSON.stringify(products));
        updateProductList();
        updateProductDropdown();
    }
}

function addToCart() {
    let productIndex = document.getElementById("selectProduct").value;
    let quantity = document.getElementById("quantity").value;
    let customerName = document.getElementById("customerName").value;

    if (productIndex !== "" && quantity > 0 && customerName) {
        let product = products[productIndex];
        let totalPrice = product.price * quantity;
        cart.push({ ...product, quantity, totalPrice, customerName });
        updateCartList();
    } else {
        alert("প্রোডাক্ট, পরিমাণ এবং কাস্টমারের নাম সঠিকভাবে নির্বাচন করুন!");
    }
}

function addCustomProduct() {
    let customName = prompt("কাস্টম পন্যের নাম লিখুন:");
    let customPrice = prompt("কাস্টম পন্যের দাম লিখুন:");
    let quantity = prompt("পরিমাণ লিখুন:");
    let customerName = document.getElementById("customerName").value;

    if (customName && customPrice && quantity && customerName) {
        let totalPrice = customPrice * quantity;
        cart.push({ name: customName, price: customPrice, quantity, totalPrice, customerName });
        updateCartList();
    } else {
        alert("কাস্টম পন্যের নাম, দাম, পরিমাণ এবং কাস্টমারের নাম সঠিকভাবে লিখুন!");
    }
}

function updateCartList() {
    let cartList = document.getElementById("cartList");
    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        cartList.innerHTML += `<li>${item.name} x${item.quantity} - ${item.totalPrice} টাকা (কাস্টমার: ${item.customerName})</li>`;
    });
}

function generateBill() {
    let customerName = document.getElementById("customerName").value;
    if (cart.length === 0 || !customerName) {
        alert("কার্টে পন্য যোগ করুন এবং কাস্টমারের নাম লিখুন!");
        return;
    }

    let billContent = `
        <h1>মা ডিজিটাল স্টুডিও</h1>
        <p>ঠিকানা: ধলাপাড়া বাজার, ঘাটাইল, টাঙ্গাইল</p>
        <p>যোগাযোগ: 01751-298460</p>
        <h2>বিল</h2>
        <p>কাস্টমার: ${customerName}</p>
        <ul>
    `;

    cart.forEach(item => {
        billContent += `<li>${item.name} x${item.quantity} - ${item.totalPrice} টাকা</li>`;
    });

    let totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    billContent += `</ul><h3>মোট টাকা: ${totalAmount} টাকা</h3>`;

    let printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>বিল</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; padding: 20px; }
                    h1, h2, h3 { color: #333; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin-bottom: 10px; }
                </style>
            </head>
            <body>
                ${billContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();

    // Save to sales history
    let sale = {
        date: new Date().toLocaleString(),
        customerName,
        items: cart,
        totalAmount
    };
    salesHistory.push(sale);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    clearCart();
}

function clearCart() {
    cart = [];
    updateCartList();
}

function showDailySales() {
    let today = new Date().toLocaleDateString();
    let dailySales = salesHistory.filter(sale => new Date(sale.date).toLocaleDateString() === today);
    displaySalesHistory(dailySales);
}

function showMonthlySales() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let monthlySales = salesHistory.filter(sale => {
        let saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    displaySalesHistory(monthlySales);
}

function displaySalesHistory(sales) {
    let historyList = document.getElementById("salesHistoryList");
    historyList.innerHTML = "";
    sales.forEach(sale => {
        historyList.innerHTML += `<li>তারিখ: ${sale.date}, কাস্টমার: ${sale.customerName}, মোট টাকা: ${sale.totalAmount} টাকা</li>`;
    });
}

// Load products and sales history on page load
window.onload = function() {
    updateProductList();
    updateProductDropdown();
};
