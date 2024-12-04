// console.log("index")

// Notification Functionality
document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // Notification Functionality
    // =========================================================
    const notify1 = document.getElementById("notify-1");
    const notify2 = document.getElementById("notify-2");
    const closeNotify1 = document.getElementById("close-notify-1");
    const closeNotify2 = document.getElementById("close-notify-2");
    const notificationWrapper = document.getElementById("notification-wrapper");
    const alignOne = document.getElementById("align-one");
    const alignTwo = document.getElementById("align-two");
    const alignSwitches = document.getElementById("align-switch");

    // State variables
    let notifyOpen = true;
    let notifyTwoOpen = true;
    let align = true;

    // Close Notification 1
    closeNotify1.addEventListener("click", () => {
        notifyOpen = false;
        notify1.classList.add("hidden");
        alignSwitches.classList.add("hidden");
        updateNotificationWrapper();
    });

    // Close Notification 2
    closeNotify2.addEventListener("click", () => {
        notifyTwoOpen = false;
        notify2.classList.add("hidden");
        alignSwitches.classList.add("hidden");
        updateNotificationWrapper();
    });

    // Align Switch
    alignOne.addEventListener("click", () => {
        align = true;
        updateAlignSwitch();
        updateNotificationWrapper();
    });

    alignTwo.addEventListener("click", () => {
        align = false;
        updateAlignSwitch();
        updateNotificationWrapper();
    });

    // Update Notification Wrapper
    function updateNotificationWrapper() {
        const widthClass = notifyOpen
            ? "w-[200%]"
            : notifyTwoOpen
                ? "w-full"
                : "w-[200%]";
        notificationWrapper.className = `relative flex transition-all ${widthClass} ${align ? "right-0" : "right-full"
            }`;
    }

    // Update Align Switch
    function updateAlignSwitch() {
        if (align) {
            alignOne.classList.add("bg-neutral-500");
            alignTwo.classList.remove("bg-neutral-500");
        } else {
            alignOne.classList.remove("bg-neutral-500");
            alignTwo.classList.add("bg-neutral-500");
        }
    }
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
