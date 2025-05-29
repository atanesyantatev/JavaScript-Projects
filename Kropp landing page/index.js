document.addEventListener("DOMContentLoaded", function () {
    const burgerButton = document.querySelector(".header-burger-button");
    const menu = document.querySelector(".mobile-menu");
    const body = document.body;
    const html = document.documentElement;

    burgerButton.addEventListener("click", function () {
        burgerButton.classList.toggle("is-active");
        menu.classList.toggle("is-active");

        body.classList.toggle("no-scroll");
        html.classList.toggle("no-scroll");

        let isMenuOpen = menu.classList.contains("is-active")

        burgerButton.setAttribute("title", isMenuOpen ? "Open menu" : "Close menu");
        burgerButton.setAttribute("aria-expanded", isMenuOpen)
    });

    let menuLinks = document.querySelectorAll(".mobile-menu-list .mobile-menu-item .header-menu-link");
    menuLinks.forEach(l => {
        if (window.innerWidth < 992) {
            burgerButton.classList.remove("is-active");
            menu.classList.remove("is-active");
            body.classList.remove("no-scroll");
            html.classList.remove("no-scroll");

            burgerButton.setAttribute("title", "Open menu");
            burgerButton.setAttribute("aria-expanded", "false")
        } 
    })
});





document.addEventListener("DOMContentLoaded", function () {
    const banner = document.querySelector(".banner");
    const paginationButtons = document.querySelectorAll(".banner-pagination-button");
    const bannerInfo = document.querySelector(".banner-info");
    const bannerTitle = document.querySelector(".banner-title");

    const slides = [
        {
            info: ` New event <br/> coming up / <time datetime="06-07">june 7</time>&nbsp;-&nbsp;<time datetime="06-13">13</time>`,
            title: "Crossfit",
            bgColor: "var(--color-dark-alternate)"
        },
        {
            info: ` Special training <br/> coming up / <time datetime="06-15">june 7</time>&nbsp;-&nbsp;<time datetime="06-13">13</time>`,
            title: "Yoga Retreat",
            bgColor: "var(--color-dark)"
        },
        {
            info: ` Limited offer <br/> coming up / <time datetime="06-22">june 7</time>&nbsp;-&nbsp;<time datetime="06-13">13</time>`,
            title: "Boxing Week",
            bgColor: "var(--color-dark-gray)"
        }
    ];

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlide(index) {
        bannerInfo.innerHTML = slides[index].info;
        bannerTitle.textContent = slides[index].title;

        banner.style.backgroundColor = slides[index].bgColor;

        paginationButtons.forEach((btn, i) => {
            btn.classList.toggle("is-current", i === index);
        });

        currentSlide = index;
    }


    paginationButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            updateSlide(index);
        });
    });


    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide(currentSlide);
    }, 5000);


    banner.addEventListener("mouseenter", () => {
        clearInterval(slideInterval);
    });

    banner.addEventListener("mouseleave", () => {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide(currentSlide);
        }, 5000);
    });

});








document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".calculate-form");
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const ageInput = document.getElementById("age");
    const genderSelect = document.getElementById("gender");
    const activitySelect = document.getElementById("activity-factor");
    const calculateButton = document.querySelector(".calculate-button");
    const bmiTable = document.querySelector(".calculate-table");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (validateForm()) {
            calculateBMI();
        }

    });


     function validateForm () {
        let isValid = true;
        resetErrors();

        if (!heightInput.value || heightInput.value <= 0) {
            showError(heightInput, "Please enter a valid height");
            isValid = false;
        }

        if (!weightInput.value || weightInput.value <= 0) {
            showError(weightInput, "Please enter a valid weight");
            isValid = false;
        }

        if (!ageInput.value || ageInput.value <= 0) {
            showError(ageInput, "Please enter a valid age");
            isValid = false;
        }

        if (!genderSelect.value) {
            showError (genderSelect, "Please select your gender");
            isValid = false;
        }

        if (!activitySelect) {
            showError (activitySelect, "Please select your activity");
            isValid = false;
        }

        return isValid;

     }

      function showError (input, message) {
        const errorElement = document.createElement("div");
        errorElement.className = "input-error";
        errorElement.textContent = message;
        errorElement.style.color = '#ff6b6b';
        errorElement.style.fontSize = "0.8rem";
        errorElement.style.marginTop = "5px";
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        input.classList.add("input-error-state");

      };

      function resetErrors () {
        const errors = document.querySelectorAll(".input-error");
        errors.forEach(error => error.remove());

        const inputs = document.querySelectorAll(".calculate-input");
        inputs.forEach(input => input.classList.remove("input-error-state"));
      }

      function calculateBMI () {
        const height = parseFloat(heightInput.value) / 100;
        const weight = parseFloat(weightInput.value);
        const age = parseFloat(ageInput.value);
        const gender = genderSelect.value;
        const activityFactor = parseFloat(activitySelect.value);

        const bmi = weight / (height * height);
        const roundedBMI = Math.round(bmi * 10) / 10;

        let bmr;
        if (gender == "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height * 100) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height * 100) - (4.330 * age);
          }

          const dailyCalories = bmr * activityFactor;

          displayResults(roundedBMI, dailyCalories);
      }


      function displayResults (bmi, calories) {
         const bmiResult = document.createElement("div");
         bmiResult.className = "bmi-result";
         bmiResult.innerHTML = `<strong> Your BMI: </strong> ${bmi}`;
         bmiResult.style.marginTop = "20px";
         bmiResult.style.fontSize = "1.2rem";
         bmiResult.style.color = 'var(--color-light)';

         const caloriesResult = document.createElement("div");
         caloriesResult.className = "calories-result";
         caloriesResult.innerHTML = `<strong>Daily Calories: </strong> ${Math.round(calories)} kcal`;
         caloriesResult.style.marginTop = "10px";
         caloriesResult.style.fontSize = "1.2rem";
         caloriesResult.style.color = "var(--color-light)";

         form.parentNode.insertBefore(bmiResult, form.nextSibling);
         form.parentNode.insertBefore(caloriesResult, form.nextSibling);

         highlightBMIRange(bmi);

      }

      function highlightBMIRange(bmi) {
        const rows = bmiTable.querySelectorAll("tbody tr");
        rows.forEach(row => row.classList.remove("highlighted"));

         if (bmi < 18.5) {
            rows[0].classList.add("highlighted");
         } else if (bmi >= 18.5 && bmi <= 24.9) {
            rows[1].classList.add("highlighted");
         } else if (bmi >= 25.0 && bmi <= 29.9) {
            rows[2].classList.add('highlighted');
          } else {
            rows[3].classList.add('highlighted');
          }
      }
})