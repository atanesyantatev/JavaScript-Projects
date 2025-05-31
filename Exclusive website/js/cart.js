document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu
  const hamburger = document.querySelector(".hamburger");
  const Nav = document.querySelector(".mobile_nav");

  const iconMenu = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>`;

  const iconClose = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12" />
    </svg>`;

  let isNavOpen = false;

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    isNavOpen = !isNavOpen;

    if (isNavOpen) {
      Nav.classList.remove("mobile_nav_hide");
      hamburger.innerHTML = iconClose;
    } else {
      Nav.classList.add("mobile_nav_hide");
      hamburger.innerHTML = iconMenu;
    }
  });

  document.body.addEventListener("click", (e) => {
    const clickIsOutOfNav = !Nav.contains(e.target);
    const clickIsOutOfHamburger = !hamburger.contains(e.target);

    if (isNavOpen && clickIsOutOfNav && clickIsOutOfHamburger) {
      Nav.classList.add("mobile_nav_hide");
      hamburger.innerHTML = iconMenu;
      isNavOpen = false;
    }
  });

  // Display products in cart
  function displayProducts() {
    let products = JSON.parse(localStorage.getItem("cart")) || [];
    let prodContainer = document.querySelector(".cart-items");
    if (!prodContainer) return;

    prodContainer.innerHTML = "";

    products.forEach((prod) => {
      let prodItem = document.createElement("div");
      prodItem.className = "cart_item";

      prodItem.innerHTML = `
        <div class="cart_box"><img src="${prod.image}" class="prod_img"></div>
        <div class="cart_box"><span class="prod_title">${prod.title}</span></div>
        <div class="cart_box"><span class="prod_price">${prod.price}$</span></div>
        <div class="cart_box"><input type="number" class="prod_quantity cart_box" min="1" value="${prod.quantity}"></div>
        <div class="cart_box"><button class="prod_delete" data-id="${prod.id}">Delete</button></div>
      `;

      prodContainer.append(prodItem);
    });

    updateTotalPrice();
    updateQuantity();
    deleteProd();
  }

  function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let totalPrice = cart.reduce((total, prod) => total + prod.quantity * prod.price, 0);

    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

    let total = document.querySelector(".total-price");
    if (total) {
      total.innerText = totalPrice.toFixed(2);
    }
  }

  function updateQuantity() {
    document.querySelectorAll(".prod_quantity").forEach(input => {
      input.addEventListener("change", () => {
        const newQuantity = parseInt(input.value);
        const prodId = input.closest(".cart_item").querySelector(".prod_delete").getAttribute("data-id");

        if (newQuantity < 1 || isNaN(newQuantity)) {
          input.value = 1;
          return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const item = cart.find(prod => prod.id === prodId);

        if (item) {
          item.quantity = newQuantity;
          localStorage.setItem("cart", JSON.stringify(cart));

          const cartDisplay = document.querySelector(".cart-count");
          if (cartDisplay) {
            let cartCount = cart.reduce((total, prod) => total + prod.quantity, 0);
            cartDisplay.textContent = cartCount;
          }

          updateTotalPrice();
        }
      });
    });
  }

  function deleteProd() {
    document.querySelectorAll(".prod_delete").forEach(button => {
      button.addEventListener("click", () => {
        const prodId = button.getAttribute("data-id");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(prod => prod.id !== prodId);
        localStorage.setItem("cart", JSON.stringify(cart));

        button.closest(".cart_item").remove();

        const cartDisplay = document.querySelector(".cart-count");
        if (cartDisplay) {
          const cartCount = cart.reduce((total, prod) => total + prod.quantity, 0);
          cartDisplay.textContent = cartCount;
        }

        updateTotalPrice();
        updateCartCount();
      });
    });
  }

  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartDisplay = document.querySelector(".cart-count");

    if (cartDisplay) {
      const cartCount = cart.reduce((total, prod) => total + prod.quantity, 0);
      cartDisplay.textContent = cartCount;

      cartDisplay.style.display = cart.length === 0 ? "none" : "flex";
    }
  }



  displayProducts();
  updateCartCount();

  //  document.querySelector(".check-button").addEventListener("click", () => {
  //     let cart = JSON.parse(localStorage.getItem("cart"));

  //     if (cart && cart.length > 0) {
  //         localStorage.setItem("cartForCheckout", JSON.stringify(cart));

  //         window.location.href = "checkout.html"
  //     } else {
  //         alert("Cart is empty!")
  //     }
  //  })

  const checkoutBtn = document.querySelector(".check-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart"));

      if (cart && cart.length > 0) {
        localStorage.setItem("cartForCheckout", JSON.stringify(cart));
        window.location.href = "checkout.html";
      } else {
        alert("Cart is empty!");
      }
    });
  }

});









