const categoryFilterSidebar = document.getElementById("category-filter-sidebar");
const categoryFilterSidebarToggles = document.querySelector("[data-toggle-category-filter-sidebar]");
const categoryFilterSidebarCloses = document.querySelectorAll("[data-close-category-filter-sidebar]");

// Toggle Sidebar
categoryFilterSidebarToggles.addEventListener("click", () => {
    if (categoryFilterSidebar.classList.contains("w-0")) {
        categoryFilterSidebar.classList.remove("hidden", "w-0");
        categoryFilterSidebar.classList.add("flex", "w-full", "lg:block", "lg:w-72");
    } else {
        categoryFilterSidebar.classList.add("hidden", "w-0");
        categoryFilterSidebar.classList.remove("flex", "w-full", "lg:block", "lg:w-72");
    }
});

// Close Sidebar
categoryFilterSidebarCloses.forEach(close => {
    close.addEventListener("click", () => {
        categoryFilterSidebar.classList.add("hidden", "w-0");
        categoryFilterSidebar.classList.remove("flex", "w-full", "lg:block", "lg:w-72");
    });
});




const categoryFaqAccordion = document.querySelector(`[data-accordion="category-faq"]`);
const categoryFaqAccordionToggleButton = document.querySelector("[data-toggle-category-faq]");
const categoryFaqAccordionHiddenItems = categoryFaqAccordion.querySelectorAll(".hidden-item");

categoryFaqAccordionToggleButton.addEventListener("click", () => {
    categoryFaqAccordionHiddenItems.forEach(item => {
        item.classList.toggle("hidden"); // Toggle Tailwind's hidden class
    });

    // Update button text
    if (categoryFaqAccordionToggleButton.textContent.trim() === "View More") {
        categoryFaqAccordionToggleButton.textContent = "View Less";
    } else {
        categoryFaqAccordionToggleButton.textContent = "View More";
    }
});
