const menuButton = document.querySelector(".menu_button");
const hamburger = document.querySelector(".hamburger");
const closeIcon = document.querySelector(".close-icon");
const mobileMenu = document.querySelector(".mobile_menu")

let state = false;


menuButton.addEventListener("click", () => {
    if (state == false) {
        state = true
        hamburger.classList.add("hidden");
        closeIcon.classList.remove("hidden");
        mobileMenu.classList.add("open")

    } else {
        state = false;
        hamburger.classList.remove("hidden");
        closeIcon.classList.add("hidden");
        mobileMenu.classList.remove("open");
    }
});


window.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
        mobileMenu.classList.remove("open");
        state = false;
        hamburger.classList.remove("hidden");
        closeIcon.classList.add("hidden");

    }
});



let translations = {};

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        translations = data;
        const savedLang = localStorage.getItem("selectedLanguage") || "en";
        switchLanguage(savedLang);
    })
    .catch(error => {
        console.error("There is an error", error);
    });

    

function switchLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang);

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = translations[lang][key];
    });

    document.querySelectorAll(".language-option").forEach(b => {
        const bLang = b.getAttribute("data-lang");
        b.classList.toggle("active", bLang === lang);
    });
}

document.querySelectorAll(".language-option").forEach(button => {
    button.addEventListener("click", () => {
        const selectedLang = button.getAttribute("data-lang");
        switchLanguage(selectedLang);
    });
});




const links = document.querySelectorAll(".nav_link1");

document.addEventListener("DOMContentLoaded", () => {
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            let chosenLink = e.target;
            let href = chosenLink.getAttribute("href")
            chosenLink.classList.add("act");
            window.location.href = href
            links.forEach(l => {
                if (l !== chosenLink) {
                    l.classList.remove("act")
                }
            })
        })
    })

});

const sizeButtons = document.querySelectorAll(".size-button");

document.addEventListener("DOMContentLoaded", () => {
    sizeButtons.forEach(b => {
        b.addEventListener("click", (e) => {
            let selectedButton = e.target;
            selectedButton.classList.add("size-button-active");
            sizeButtons.forEach(b => {
                if (b !== selectedButton) {
                    b.classList.remove("size-button-active")
                }
            })
        })
    })
})




let selectedSizeButton

document.addEventListener("DOMContentLoaded", () => {
    const sizeButtons = document.querySelectorAll(".size-button");
    sizeButtons.forEach(b => {

        b.addEventListener("click", (e) => {
            selectedSizeButton = e.target;
            selectedSizeButton.classList.add("size-button-active");
            sizeButtons.forEach(s => {
                if (s !== selectedSizeButton) {
                    s.classList.remove("size-button-active");
                }
            })
        })
    })
})





document.addEventListener("DOMContentLoaded", function () {
    const selectedProducts = loadSelectedProducts();
    updateUI(selectedProducts);
    attachCardEventListeners(selectedProducts);
    attachSizeButtonListeners();
});


function loadSelectedProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}


function updateUI(selectedProducts) {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        if (selectedProducts.some(product => product.id === cardId)) {
            card.classList.add('card_active');
        } else {
            card.classList.remove('card_active');
        }
    });

    const reserveContainer = document.querySelector('.reserve_container');
    if (reserveContainer) {
        reserveContainer.innerHTML = '';

        selectedProducts.forEach(product => {
            const reserveProdContainer = document.createElement('div');
            reserveProdContainer.classList.add('reserve_prod_container');
            reserveProdContainer.setAttribute('data-id', product.id);

            reserveProdContainer.innerHTML = `
                    <p class="reserve_prod_title" data-i18n="${product.title}">${product.title}</p>
                    <div class="reserve-prod">
                        <div class="res-prod">
                            <img src="${product.img}" class="res-prod-img">
                        </div>
                        <div class="res-prod-info">
                            <div class="res-prod-price">${product.price}$</div>
                            <div class="size-buttons">
                                <div class="size-button" data-size="L">L</div>
                                <div class="size-button" data-size="XL">XL</div>
                                <div class="size-button" data-size="XXL">XXL</div>
                            </div>
                            <div class="add-to-cart" 
                                data-id="${product.id}" 
                                data-title="${product.title}" 
                                data-img="${product.img}" 
                                data-price="${product.price}" 
                                data-i18n="add" data-quantity="1">Add to cart</div>
                        </div>
                    </div>
                `;
            reserveContainer.append(reserveProdContainer);
        });
    }
}


function attachSizeButtonListeners() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("size-button")) {
            const allButtons = e.target.closest(".size-buttons").querySelectorAll(".size-button");
            allButtons.forEach(btn => btn.classList.remove("size-button-active"));
            e.target.classList.add("size-button-active");
        }
    });
}

function attachCardEventListeners(selectedProducts) {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const productId = card.getAttribute('data-id');
            const product = {
                id: productId,
                title: card.getAttribute('data-title'),
                img: card.getAttribute('data-img'),
                price: card.getAttribute('data-price')
            };

            const isSelected = card.classList.contains('card_active');

            if (isSelected) {
                card.classList.remove('card_active');
                const index = selectedProducts.findIndex(p => p.id === productId);
                if (index !== -1) selectedProducts.splice(index, 1);
            } else {
                card.classList.add('card_active');
                selectedProducts.push(product);
            }

            localStorage.setItem('products', JSON.stringify(selectedProducts));
            updateUI(selectedProducts);
        });
    });

    const reserveContainer = document.querySelector('.reserve_container');
    if (reserveContainer) {
        reserveContainer.addEventListener('click', function (e) {
            if (e.target && e.target.classList.contains('add-to-cart')) {
                const productId = e.target.getAttribute('data-id');

            }
        });
    }
}



function addToCart() {
    let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(add => {
        add.addEventListener("click", () => {
            let id = add.getAttribute("data-id");
            let img = add.getAttribute("data-img");
            let price = add.getAttribute("data-price");
            let title = add.getAttribute("data-title");
            let quantity = add.getAttribute("data-quantity");
            let container = add.closest('.reserve_prod_container');


            let size = container.querySelector(".size-buttons");
            let activeSize = size.querySelector(".size-button-active");
            let prodSize = activeSize ? activeSize.getAttribute("data-size") : "L";


            let cartProd = { id, img, price, title, prodSize, quantity };

            let isInArray = cartProducts.some(p => p.id == id);

            if (isInArray) {
                console.log("The product is already in the cart.");
            } else {
                cartProducts.push(cartProd);
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
            }

            cartDisplay();
        });


    });
}




document.addEventListener("DOMContentLoaded", () => {
    addToCart();
});

addToCart()



function displayCartProducts() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    if (cartProducts.length == 0) {
        console.log("There is no product");

    } else {
        const cart = document.querySelector(".cart-products");
        if (cart) {
            console.log(cart);
            cart.innerHTML = ""

        };

        cartProducts.forEach(product => {
            const cartProd = document.createElement("div");
            cartProd.className = "cart-product";
            cartProd.innerHTML = `
            
                <div class="cartprod-img">
        <img src="${product.img}">
        </div>
        <div class="cart-info1">
        <h1 class="cart-info1-title" data-i18n="${product.title}">${product.title}</h1>
        <p class="cart-info1-size">${product.prodSize}</p>
        <div class="dropdown-container" id="dropdown">
            <div class="selected-value">
            <span id="selected" data-id="${product.id}">1</span>
            <span id="arrow-down"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
            </div>
            <div class="options" data-id="${product.id}">
            <div class="option">1</div>
            <div class="option">2</div>
            <div class="option">3</div>
            <div class="option">4</div>
            </div>
        </div>

        </div>

        <div class="cart-info2">
        <button class="trash" data-id="${product.id}"><img src="images/bin.svg"></button>
        <div class="cartprod-price" data-id="${product.id}">$${product.price}</div>
        </div>


            `;

            if (cart) {
                cart.append(cartProd)
            }
        })

    }

    deleteProduct(cartProducts);
}


displayCartProducts();



document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown-container");

    dropdowns.forEach(dropdown => {
        const arrow = dropdown.querySelector("#arrow-down");
        const selected = dropdown.querySelector("#selected");
        const options = dropdown.querySelectorAll(".option");

        arrow.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove("open");
            });
            dropdown.classList.toggle("open");
        });

        options.forEach(option => {
            option.addEventListener("click", () => {
                selected.textContent = option.textContent;
                dropdown.classList.remove("open");

            });
        });
    });

    document.addEventListener("click", (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    prodQuantity();
    checkoutPrice();
    deleteProduct();
    prodTotalPrice();
    cartDisplay();
});

function prodQuantity() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

    cartProducts.forEach(cartProd => {
        const optionContainer = document.querySelector(`.options[data-id="${cartProd.id}"]`);
        const options = optionContainer?.querySelectorAll(".option");
        const selected = document.querySelector(`#selected[data-id="${cartProd.id}"]`);
        const priceElement = document.querySelector(`.cartprod-price[data-id="${cartProd.id}"]`);

        if (!optionContainer || !selected || !options || !priceElement) return;

        if (!cartProd.unitPrice) {
            cartProd.unitPrice = cartProd.price;
        }

        const quantity = parseInt(cartProd.quantity) || 1;
        selected.textContent = quantity;

        cartProd.totalPrice = (cartProd.unitPrice * quantity).toFixed(2);
        priceElement.textContent = `$${cartProd.totalPrice}`;

        options.forEach(option => {
            option.addEventListener("click", () => {
                const selectedQuantity = parseInt(option.textContent);
                selected.textContent = selectedQuantity;
                const dropdown = option.closest(".dropdown");
                dropdown?.classList.remove("open");

                cartProd.quantity = selectedQuantity;
                const totalPrice = cartProd.unitPrice * selectedQuantity;
                priceElement.textContent = `$${totalPrice.toFixed(2)}`;
                cartProd.totalPrice = totalPrice.toFixed(2);

                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                checkoutPrice();
                prodTotalPrice();
            });
        });
    });

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

function checkoutPrice() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    let checkPrice = cartProducts.reduce((a, b) => a + (parseFloat(b.totalPrice) || 0), 0);
    let totalPriceElements = document.querySelectorAll(".total-price");

    totalPriceElements.forEach(el => {
        el.textContent = cartProducts.length === 0 ? "$0" : `$${checkPrice.toFixed(2)}`;
    });
}

function prodTotalPrice() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    let checkPrice = cartProducts.reduce((a, b) => a + (parseFloat(b.totalPrice) || 0), 0);
    let finalPrice = checkPrice + 10;
    let finalPriceElements = document.querySelectorAll(".final-price");

    finalPriceElements.forEach(el => {
        el.textContent = cartProducts.length === 0 ? "$0" : `$${finalPrice.toFixed(2)}`;
    });
}

function deleteProduct() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const deleteButtons = document.querySelectorAll(".trash");

    deleteButtons.forEach(d => {
        d.addEventListener("click", () => {
            let id = d.getAttribute("data-id");
            cartProducts = cartProducts.filter(p => p.id !== id);
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

            const productElement = d.closest(".cart-product");
            if (productElement) {
                productElement.remove();
            }

            checkoutPrice();
            prodTotalPrice();
            cartDisplay();
        });
    });
}

function cartDisplay() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    let cartCount = document.querySelector(".cart-count");

    if (cartProducts.length == 0) {
        cartCount.classList.add("none");
    } else {
        cartCount.classList.remove("none");
    }
}




document.addEventListener("DOMContentLoaded", () => {
    prodQuantity();
    checkoutPrice();
    deleteProduct();
    prodTotalPrice();
    cartDisplay();
    displayLikedProducts();
});

cartDisplay();



document.addEventListener("DOMContentLoaded", () => {
    let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];

    const iconHearts = document.querySelectorAll(".icon_heart");

    iconHearts.forEach(icon => {
        const id = icon.getAttribute("data-id");

        if (likedProducts.includes(id)) {
            icon.classList.add("like");
        }

        icon.addEventListener("click", () => {
            const isLiked = icon.classList.contains("like");

            if (isLiked) {
                icon.classList.remove("like");
                likedProducts = likedProducts.filter(productId => productId !== id);
            } else {
                icon.classList.add("like");
                likedProducts.push(id);
            }

            localStorage.setItem("likedProducts", JSON.stringify(likedProducts));

            displayLikedProducts();

        });
    });

    displayLikedProducts();
});




function displayLikedProducts() {
    const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
    let container = document.querySelector(".favorites-container")
    if (container) {
        const allCards = container.querySelectorAll(".card");
         allCards.forEach(card => {
        const id = card.getAttribute("data-id");
        if (likedProducts.includes(id)) {
            card.style.display = "flex";  
        } else {
            card.style.display = "none";
        }
    });
    }

   
}



document.addEventListener("DOMContentLoaded", () => {
    displayLikedProducts();
})












