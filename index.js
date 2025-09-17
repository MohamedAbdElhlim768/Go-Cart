        const links = document.querySelectorAll("a.nav-link, a.btn"); 
    const loader = document.getElementById("loader");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
        if (link.getAttribute("href") && !link.getAttribute("href").startsWith("#")) {
            e.preventDefault();
            loader.style.display = "flex";
            setTimeout(() => {
            window.location.href = link.getAttribute("href");
            }, 500); // يخلي التنقل يتأخر 0.5 ثانية
        }
        });
    });
    let allItems = [];
    // يجيب اسم الصفحة الحالية
    const currentPage = window.location.pathname.split("/").pop();

    // يحدد كل اللينكات
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        if(link.getAttribute("href") === currentPage){
        link.classList.add("active");
        } else {
        link.classList.remove("active");
        }
    });
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // ✅ تحميل السلة من localStorage

    // جلب المنتجات
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            allItems = data;

            if (document.getElementById('inner')) {
                display();
            }

            if (document.getElementById('products')) {
                displayProducts();
            }

            if (document.getElementById('addCart')) {
                addCart(); // ✅ عرض السلة المحفوظة
            }
        })
        .catch(error => console.error('Error:', error));

    // عرض 8 منتجات بس
    function display() {
        let cartona = ``;

        for (let i = 0; i < Math.min(allItems.length, 8); i++) {
            const isInCart = cart.some(item => item.id === allItems[i].id);
            cartona += `
            <div class="col-md-3 mb-4">
                <div class="items text-center">
                    <span class="wishlist text-end">
                        <i class="heart-icon ${isInCart ? "fa-solid" : "fa-regular"} fa-heart" 
                        style="color:${isInCart ? "red" : ""}" 
                        data-id="${allItems[i].id}"></i>
                    </span>
                    <img class="w-100" src="${allItems[i].image}" alt="">
                    <h3>${allItems[i].category}</h3>
                    <p>${allItems[i].price}$</p>
                </div>
            </div>
            `;
        }

        cartona += `
            <div class="text-center my-4">
                <a href="products.html" class="btn btn-success btn-lg">View More Products</a>
            </div>
        `;

        document.getElementById('inner').innerHTML = cartona;
        addHeartListeners();
    }

    // عرض كل المنتجات
    function displayProducts() {
        let container = ``;

        for (let i = 0; i < allItems.length; i++) {
            const isInCart = cart.some(item => item.id === allItems[i].id);
            container += `
            <div class="col-md-3 mb-4">
                <div class="items text-center">
                    <span class="wishlist text-end">
                        <i class="heart-icon ${isInCart ? "fa-solid" : "fa-regular"} fa-heart" 
                        style="color:${isInCart ? "red" : ""}" 
                        data-id="${allItems[i].id}"></i>
                    </span>
                    <img class="w-100" src="${allItems[i].image}" alt="">
                    <h3>${allItems[i].category}</h3>
                    <p>${allItems[i].price}$</p>
                </div>
            </div>
            `;
        }

        document.getElementById('products').innerHTML = container;
        addHeartListeners();
    }

    // التعامل مع القلوب
    function addHeartListeners() {
        const hearts = document.querySelectorAll('.heart-icon');
        hearts.forEach(heart => {
            heart.addEventListener('click', function () {
                const productId = parseInt(heart.getAttribute("data-id"));
                const product = allItems.find(item => item.id === productId);

                if (heart.style.color === "red") {
                    heart.style.color = "";
                    heart.classList.add("fa-regular");
                    heart.classList.remove("fa-solid");

                    cart = cart.filter(item => item.id !== product.id);
                } else {
                    heart.style.color = "red";
                    heart.classList.add("fa-solid");
                    heart.classList.remove("fa-regular");

                    cart.push(product);
                }

                localStorage.setItem("cart", JSON.stringify(cart)); 
                addCart(); 
            });
        });
    }

    // عرض السلة + زرار Remove
    function addCart() {
        if (!document.getElementById('addCart')) return;

        let add = ``;
        for (let i = 0; i < cart.length; i++) {
            add += `
            <div class="col-md-3 mb-4">
                <div class="items text-center p-3 border rounded shadow-sm">
                    <img class="w-100 mb-2" src="${cart[i].image}" alt="">
                    <h3>${cart[i].category}</h3>
                    <p>${cart[i].price}$</p>
                    <button class="btn btn-danger remove-btn" data-id="${cart[i].id}">Remove</button>
                </div>
            </div>
            `;
        }
        document.getElementById('addCart').innerHTML = add;

        // ✅ إضافة أحداث زرار Remove
        const removeBtns = document.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = parseInt(btn.getAttribute("data-id"));
                cart = cart.filter(item => item.id !== productId);

                localStorage.setItem("cart", JSON.stringify(cart));
                addCart(); // تحديث العرض
            });
        });
    }
    
