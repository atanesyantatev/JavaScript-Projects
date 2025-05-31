
// Countdown Timer
const demoEl = document.getElementById("demo");
if (demoEl) {
  const countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();

  const x = setInterval(function () {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    demoEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
      clearInterval(x);
      demoEl.innerHTML = "EXPIRED";
    }
  }, 1000);
}

// Swiper Carousel
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 10 },
    768: { slidesPerView: 3, spaceBetween: 10 },
    1024: { slidesPerView: 4, spaceBetween: 10 },
  },
});

// Scroll Animations
ScrollReveal().reveal(".top_nav", { origin: "bottom", distance: "20px", opacity: 0 });
ScrollReveal().reveal(".nav", { origin: "bottom", distance: "20px", opacity: 0, delay: 100 });
ScrollReveal().reveal(".header", { origin: "bottom", distance: "20px", opacity: 0, delay: 200 });
ScrollReveal().reveal(".section", { origin: "bottom", distance: "20px", opacity: 0, duration: 1000, delay: 100 });
ScrollReveal().reveal(".footer", { origin: "bottom", distance: "20px", opacity: 0, duration: 1000, delay: 100 });

// Mobile Menu
let hamburger = document.querySelector(".hamburger");
let Nav = document.querySelector(".mobile_nav");

let iconMenu = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>`;

let iconClose = `
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
  if (isNavOpen && !Nav.contains(e.target) && !hamburger.contains(e.target)) {
    Nav.classList.add("mobile_nav_hide");
    hamburger.innerHTML = iconMenu;
    isNavOpen = false;
  }
});

// Cart System
const cartDisplay = document.querySelector(".cart-count");

let cart;
try {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  cart = Array.isArray(storedCart) ? storedCart : [];
} catch (e) {
  cart = [];
}

let cartCount = cart.reduce((total, item) => total + item.quantity, 0);
cartDisplay.textContent = cartCount;

document.querySelectorAll(".add_to_cart").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const title = button.getAttribute("data-title");
    const image = button.getAttribute("data-image");
    const price = parseFloat(button.getAttribute("data-price"));

    const cartItem = { id, title, image, price, quantity: 1 };
    const existingItem = cart.find(item => item.id == id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartDisplay.textContent = cartCount;

    updateCartCount();
  });
});


// // Eye icon

document.addEventListener("DOMContentLoaded", function () {
  const eyeIcons = document.querySelectorAll(".card_top_icon:last-child");

  eyeIcons.forEach(icon => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation();

      const cardImg = this.closest(".card_top").querySelector(".card_img");

      Fancybox.show([{
        src: cardImg.src,
        type: "image"
      }])
    });
  });
});

// Update Cart Count Display
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartDisplay = document.querySelector(".cart-count");

  if (cartDisplay) {
    const cartCount = cart.reduce((total, prod) => total + prod.quantity, 0);
    cartDisplay.textContent = cartCount;
    cartDisplay.style.display = cartCount === 0 ? "none" : "flex";
  }
}



updateCartCount();


// Search
const input = document.querySelector(".nav_input");
const products = document.querySelectorAll(".card_body");

input.addEventListener("change", (e) => {
  const value = e.target.value.toLowerCase();
  products.forEach(body => {
    const title = body.querySelector(".card_title").textContent.toLowerCase();
    const card = body.closest(".card");
    card.style.display = title.includes(value) ? "block" : "none";
  });
});


// Buy now


const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("myModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const buyForm = document.getElementById("buyForm");

// openModalBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   modal.classList.add("show");
// });

// closeModalBtn.addEventListener("click", () => {
//   modal.classList.remove("show");
// });


if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("show");
  });


  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

buyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks for your purchase!");
  modal.classList.remove("show");
  buyForm.reset();
});





// Heart Count
let likeCards = JSON.parse(localStorage.getItem("likedCards")) || [];
let heartCount = likeCards.length;
localStorage.setItem("heartCount", heartCount);

const heartDisplay = document.querySelector(".heart-count");
heartDisplay.textContent = heartCount;

document.querySelectorAll(".card").forEach(card => {
  const heartIcon = card.querySelector(".card_top_icon:nth-child(1)");
  const cardId = card.querySelector(".add_to_cart").getAttribute("data-id");


  if (likeCards.includes(cardId)) {
    heartIcon.classList.add("active");
    heartIcon.style.fill = "red";
  }

  heartIcon.addEventListener("click", () => {
    if (!likeCards.includes(cardId)) {
      heartIcon.classList.add("active");
      heartIcon.style.fill = "red";
      likeCards.push(cardId);
    } else {
      heartIcon.classList.remove("active");
      heartIcon.style.fill = "none";
      likeCards = likeCards.filter(id => id !== cardId);
    }


    heartCount = likeCards.length;
    heartDisplay.textContent = heartCount;


    localStorage.setItem("heartCount", heartCount);
    localStorage.setItem("likedCards", JSON.stringify(likeCards));
  });
});




// Save products in LocalStorage 

let shopProducts = [];

document.querySelectorAll('.add_to_cart').forEach(b => {
  let id = b.getAttribute("data-id");
  let title = b.getAttribute("data-title");

  let image = b.getAttribute("data-image");

  let price = b.getAttribute("data-price");

  let product = { id, title, image, price };
  shopProducts.push(product);
});


localStorage.setItem("products", JSON.stringify(shopProducts));









































