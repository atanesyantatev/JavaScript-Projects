window.addEventListener("load", () => {
    let likes = JSON.parse(localStorage.getItem("likedCards")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let favorites = products.filter(p => likes.includes(p.id));

    let likesContainer = document.querySelector(".favorite-container");

    favorites.forEach(f => {
        let likeItem = document.createElement("div");
        likeItem.className = "favorite-item";

        // Render the card with a red heart (since it's liked)
        likeItem.innerHTML = `
            <div class="card" data-id="${f.id}">
                <div class="card_top">
                    <img src="${f.image}" alt="" class="card_img" />
                    <div class="card_top_icons">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="card_top_icon fav_icon" style="cursor: pointer;">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                </div>
                <div class="card_body">
                    <h3 class="card_title">${f.title}</h3>
                    <p class="card_price">${f.price}$</p>
                </div>
            </div>
        `;

        likesContainer.append(likeItem);

        // Add click listener to remove from favorites
        const favIcon = likeItem.querySelector(".fav_icon");

        favIcon.addEventListener("click", () => {
            // Remove from DOM
            likeItem.remove();

            // Remove from likes array
            likes = likes.filter(id => id !== f.id);

            // Update localStorage
            localStorage.setItem("likedCards", JSON.stringify(likes));
        });
    });
});





