// console.log("index")

import { toast } from "./components.js";

// Notification Functionality
document.addEventListener("DOMContentLoaded", () => {
    const notificationContainer = document.querySelector("[data-notification-container]");
    const notificationItems = document.querySelectorAll("[data-notification-item]");
    const notificationSwitches = document.querySelectorAll("[data-notification-switch]");
    const switchContainer = document.querySelector("[data-notification-switch-container]");
    let activeIndex = 0;
    let autoSlideInterval;

    const updateActiveNotification = (index) => {
        notificationItems.forEach((item, idx) => {
            item.classList.toggle("hidden", idx !== index);
            item.classList.toggle("block", idx === index);
        });
        notificationSwitches.forEach((switchElem, idx) => {
            switchElem.classList.toggle("bg-neutral-500", idx === index);
        });
    };

    const startAutoSlide = () => {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            activeIndex = (activeIndex + 1) % notificationItems.length;
            updateActiveNotification(activeIndex);
        }, 7000);
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    };

    // Close notification item
    notificationContainer.addEventListener("click", (e) => {
        if (e.target.hasAttribute("data-notification-close")) {
            const item = e.target.parentNode;

            item.remove();

            // Update references
            const remainingItems = document.querySelectorAll("[data-notification-item]");
            if (remainingItems.length === 1) {
                switchContainer.classList.add("hidden");
            }
            if (remainingItems.length === 0) {
                stopAutoSlide();
            } else {
                activeIndex = activeIndex % remainingItems.length; // Adjust activeIndex
                updateActiveNotification(activeIndex);
                startAutoSlide();
            }
        }
    });

    // Switch notification on click
    notificationSwitches.forEach((switchElem, idx) => {
        switchElem.addEventListener("click", () => {
            activeIndex = idx;
            updateActiveNotification(activeIndex);
            startAutoSlide();
        });
    });

    // Swipe functionality
    let startX = 0;
    let isSwiping = false;

    notificationContainer.addEventListener("touchstart", (e) => {
        isSwiping = true;
        startX = e.touches[0].clientX;
    });

    notificationContainer.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        const diffX = e.touches[0].clientX - startX;

        if (Math.abs(diffX) > 50) {
            isSwiping = false;
            if (diffX > 0) {
                // Swipe right
                activeIndex = (activeIndex - 1 + notificationItems.length) % notificationItems.length;
            } else {
                // Swipe left
                activeIndex = (activeIndex + 1) % notificationItems.length;
            }
            updateActiveNotification(activeIndex);
            startAutoSlide();
        }
    });

    notificationContainer.addEventListener("touchend", () => {
        isSwiping = false;
    });

    // Initialize
    if (notificationItems.length === 1) {
        switchContainer.classList.add("hidden");
    }
    updateActiveNotification(activeIndex);
    startAutoSlide();
});

// overscreenAskus Button Position
document.addEventListener("DOMContentLoaded", () => {
    const overscreenAskus = document.querySelector("[data-overscreen-askus]");

    if (!overscreenAskus) return;

    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;
        const scrollThreshold = totalHeight * 0.70;

        if (scrollPosition >= scrollThreshold) {
            overscreenAskus.classList.remove("hidden");
        } else {
            overscreenAskus.classList.add("hidden");
        }
    };

    window.addEventListener("scroll", handleScroll);
});

// Mobile Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
    const fullscreenSearch = document.querySelector("[data-fullscreen-search]")
    const fullscreenSearchClose = document.querySelectorAll("[data-fullscreen-search-close]")
    const fullscreenSearchOpen = document.querySelectorAll("[data-fullscreen-search-Open]")

    fullscreenSearchOpen.forEach(elemment => (
        elemment.addEventListener("click", () => {
            fullscreenSearch.classList.add("block");
            fullscreenSearch.classList.remove("hidden");
        })
    ))

    fullscreenSearchClose.forEach(elemment => (
        elemment.addEventListener("click", () => {
            fullscreenSearch.classList.add("hidden");
            fullscreenSearch.classList.remove("block");
        })
    ))
});

// Search Suggestion
document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll("[data-search]");
    const searchData = [
        { title: "JavaScript Basics", link: "/courses/js-basics" },
        { title: "Learn React", link: "/courses/react" },
        { title: "TailwindCSS Mastery", link: "/courses/tailwind" },
        { title: "Next.js Advanced", link: "/courses/nextjs" },
        { title: "Web Development", link: "/courses/webdev" },
    ];

    inputs.forEach(input => {
        const dataSearchValue = input.getAttribute("data-search");
        const suggestionContainer = document.querySelector(`[data-search-suggestion="${dataSearchValue}"]`);
        const suggestionList = suggestionContainer.querySelector("ul");
        let filteredItems = [];
        let highlightedIndex = -1;

        // Show suggestions
        input.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            filteredItems = searchData.filter(item => item.title.toLowerCase().includes(query));
            renderSuggestions(filteredItems, suggestionList);
            suggestionContainer.classList.remove("hidden");
            highlightedIndex = -1;
        });

        // Handle keyboard navigation
        input.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown" && filteredItems.length > 0) {
                e.preventDefault();
                highlightedIndex = (highlightedIndex + 1) % filteredItems.length;
                highlightSuggestion(suggestionList, highlightedIndex);
            } else if (e.key === "ArrowUp" && filteredItems.length > 0) {
                e.preventDefault();
                highlightedIndex = (highlightedIndex - 1 + filteredItems.length) % filteredItems.length;
                highlightSuggestion(suggestionList, highlightedIndex);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    const selectedItem = filteredItems[highlightedIndex];
                    selectItem(selectedItem, input, suggestionContainer);
                } else {
                    const formattedQuery = input.value.trim().replace(/\s+/g, '+');
                    window.location.href = `/online/search/courses?title=${formattedQuery}`;
                    suggestionContainer.classList.add("hidden");
                }
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener("mousedown", (e) => {
            if (!input.contains(e.target) && !suggestionContainer.contains(e.target)) {
                suggestionContainer.classList.add("hidden");
            }
        });

        // Select item on click
        suggestionContainer.addEventListener("click", (e) => {
            const clickedItem = e.target.closest("a");
            if (clickedItem) {
                const selectedItem = filteredItems.find(item => item.title === clickedItem.textContent);
                selectItem(selectedItem, input, suggestionContainer);
            }
        });
    });

    function renderSuggestions(items, suggestionList) {
        suggestionList.innerHTML = "";
        if (items.length > 0) {
            items.forEach(item => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<a class="p-sm block cursor-pointer hover:bg-secondary" href="${item.link}">${item.title}</a>`;
                suggestionList.appendChild(listItem);
            });
        } else {
            suggestionList.innerHTML = `<li class="p-sm cursor-default text-center text-muted-foreground">No results found</li>`;
        }
    }

    function highlightSuggestion(suggestionList, index) {
        const items = suggestionList.querySelectorAll("li a");
        items.forEach((item, i) => {
            item.classList.toggle("bg-secondary", i === index);
        });
    }

    function selectItem(item, input, suggestionContainer) {
        input.value = item.title;
        window.location.href = item.link;
        suggestionContainer.classList.add("hidden");
    }
});

// Askus course search suggestion
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("askus-course-input");
    const suggestionList = document.getElementById("askus-course-input-suggestion");
    const suggestions = Array.from(suggestionList.querySelectorAll("li"));

    // Filter suggestions based on input value
    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();

        // Show or hide suggestions based on the query
        suggestions.forEach(suggestion => {
            const text = suggestion.textContent.toLowerCase();
            if (text.includes(query)) {
                suggestion.classList.remove("hidden");
            } else {
                suggestion.classList.add("hidden");
            }
        });

        // Show the dropdown if there are matching suggestions
        const hasVisibleSuggestions = suggestions.some(suggestion => !suggestion.classList.contains("hidden"));
        if (hasVisibleSuggestions) {
            suggestionList.classList.remove("hidden");
        } else {
            suggestionList.classList.add("hidden");
        }
    });

    // Handle clicking on a suggestion
    suggestionList.addEventListener("click", event => {
        if (event.target.tagName === "LI") {
            input.value = event.target.textContent;
            suggestionList.classList.add("hidden");
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", event => {
        if (!suggestionList.contains(event.target) && event.target !== input) {
            suggestionList.classList.add("hidden");
        }
    });
});

// Cart Card functionality
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-card-container");
    const cartItemsTotal = document.querySelector("[data-cart-items-total]");
    const cartItemCalculation = document.querySelector("[data-cart-item-calculation]");
    const cartItemEmpty = document.querySelector("[data-cart-item-empty]");

    let totalPrice = 0;
    let totalOriginalPrice = 0;

    // Update cart UI
    function updateCartUI() {
        const totalItems = cartContainer.children.length;

        // Update total items badge
        if (totalItems > 0) {
            cartItemsTotal.textContent = totalItems;
            cartItemsTotal.classList.remove("hidden");
            cartItemCalculation.classList.remove("hidden");
            cartItemEmpty.classList.add("hidden");
        } else {
            cartItemsTotal.textContent = 0;
            cartItemsTotal.classList.add("hidden");
            cartItemCalculation.classList.add("hidden");
            cartItemEmpty.classList.remove("hidden");
        }

        // Update total price display
        const totalDisplay = cartItemCalculation.querySelector("span");
        const originalPriceDisplay = cartItemCalculation.querySelector("s");

        totalDisplay.textContent = `Total: $${totalPrice.toFixed(2)}`;
        originalPriceDisplay.textContent = `$${totalOriginalPrice.toFixed(2)}`;
    }

    // Add a new cart card
    function addCartCard({ image, title, author, price, oldPrice }) {
        const cartCard = document.createElement("div");
        cartCard.className = "relative w-full cart-card";
        cartCard.setAttribute("data-cart-card", "");

        cartCard.innerHTML = `
            <div class="absolute top-xs right-xs text-foreground/70 hover:text-foreground cursor-pointer z-10" data-cart-card-remove>
                <img src="./images/icon/x.svg" alt="Remove Icon">
            </div>
            <a href="#" class="relative p-sm w-full size-fit flex gap-base items-center group cursor-pointer z-0">
                <div class="size-16">
                    <img class="size-16 object-cover object-center border" src="${image}" width="64" height="64" alt="Course Image" />
                </div>
                <div class="flex-1">
                    <div class="line-clamp-2 leading-4 font-semibold">${title}</div>
                    <div class="text-xs text-muted-foreground line-clamp-1">${author}</div>
                    <div class="text-left">
                        <span class="font-bold">${price}</span>
                        <s class="ml-1 text-sm text-muted-foreground">${oldPrice}</s>
                    </div>
                </div>
            </a>
        `;

        // Update total prices
        totalPrice += parseFloat(price.replace("$", ""));
        totalOriginalPrice += parseFloat(oldPrice.replace("$", ""));

        cartContainer.appendChild(cartCard);
        attachRemoveEvent(cartCard);
        updateCartUI();
    }

    // Remove cart card
    function attachRemoveEvent(cartCard) {
        const removeButton = cartCard.querySelector("[data-cart-card-remove]");
        removeButton.addEventListener("click", () => {
            const price = parseFloat(cartCard.querySelector(".font-bold").textContent.replace("$", ""));
            const oldPrice = parseFloat(cartCard.querySelector("s").textContent.replace("$", ""));

            // Update total prices
            totalPrice -= price;
            totalOriginalPrice -= oldPrice;

            cartCard.remove();
            updateCartUI();
            toast({ description: "This course is removed from the cart" });
        });
    }

    // Example usage of adding a new cart card
    document.querySelectorAll("[data-add-to-cart-button]").forEach((element) => {
        element.addEventListener("click", () => {
            addCartCard({
                image: "./images/common/error.png",
                title: "Learn JavaScript in Depth",
                author: "John Doe",
                price: "$79.99",
                oldPrice: "$159.99",
            });
            toast({ description: "This course is added to cart" });
        });
    });

    // Attach remove events for existing cards
    document.querySelectorAll("[data-cart-card]").forEach((cartCard) => {
        attachRemoveEvent(cartCard);
    });

    // Initialize cart UI
    updateCartUI();
});

