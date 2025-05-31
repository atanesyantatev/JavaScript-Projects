document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".input_wrapper").forEach(wrapper => {
    const input = wrapper.querySelector(".cont_input");
    const star = wrapper.querySelector(".cont_star");

    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        star.style.display = "none";
      } else {
        star.style.display = "inline";
      }
    });
  });
});



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

