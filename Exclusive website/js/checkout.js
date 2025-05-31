window.addEventListener("load", () => {
    let cartForCheckout = JSON.parse(localStorage.getItem("cartForCheckout"));
    let paymentContainer = document.querySelector(".payment_container")

    if (cartForCheckout) {
        let container = document.querySelector(".checkout-part")
        let total;

        let prodContainer = document.querySelector(".check_prod_container");
        cartForCheckout.forEach(p => {
            let prod = document.createElement("div");
            subtotal = p.price * p.quantity;
            total = cartForCheckout.reduce((total, prod) => total + prod.price * prod.quantity, 0);

            prod.className = "check-item";
            prod.innerHTML = `
              <img src="${p.image}" class="check_img">
              <p class="check_title">${p.title}</p>
              <span class="check_price">${p.price * p.quantity}$</span>
            `
            prodContainer.append(prod);


        });

        for (let i = 0; i < 3; i++) {
            let totalContainer = document.createElement("div");
            totalContainer.className = "check_total"
            // container.append(totalContainer);
               container.insertBefore(totalContainer, paymentContainer);

            if (i === 0) {
                totalContainer.innerHTML = `
         
           <p class="sb_total">Subtotal:</p>
           <span class="sb_price"></span>
           <span class="sb_price">${total}$</span>
        `
            } else if (i === 1) {
                totalContainer.innerHTML = `
         
           <p class="sb_total">Shipping:</p>
           <span class="sb_price"></span>
           <span class="sb_price">free</span>
        `
            } else {
                totalContainer.innerHTML = `
         
           <p class="sb_total">Total:</p>
           <span class="sb_price"></span>
           <span class="sb_price">${total}$</span>
        `
            }
        }
       


    } else {
        console.log('Not found');

    }
})