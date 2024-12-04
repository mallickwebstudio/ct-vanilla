import { categoryDatas } from "./database.js";
console.log("layout")
// Function to render categories
document.addEventListener("DOMContentLoaded", () => {
    // Function to render categories
    const renderCategories = (container, categories) => {
        categories.forEach((category) => {
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("hover:bg-secondary", "px-base", "py-xs", "cursor-pointer", "group/category");
            categoryDiv.innerHTML = `
    <a class="group-hover/category:text-active flex justify-between items-center gap-base" href="${category.href}">
        <span>${category.category_name}</span>
        ${category.subCategories.length > 0 ? `
            <img class="shrink-0 size-4" src="../../public/images/icon/arrow-right.svg" alt="Right arrow icon" />

        ` : ''}
    </a>
    ${category.subCategories.length > 0 ? `
        <div class="group-hover/category:block left-full absolute -inset-px hidden bg-background shadow-md border size-[calc(100%_+_2px)]">
            <div class="h-full overflow-y-scroll">
                ${category.subCategories.map(subCategory => `
                    <div class="hover:bg-secondary px-base py-xs hover:text-active cursor-pointer group/subcategory">
                        <a class="group-hover/subcategory:text-active flex justify-between items-center gap-base" href="${subCategory.href}">
                            <span>${subCategory.category_name}</span>
                            ${subCategory.subSubCategories.length > 0 ? `
                                <img class="shrink-0 size-4" src="../../public/images/icon/arrow-right.svg" alt="Right arrow icon" />
                            ` : ''}
                        </a>
                        ${subCategory.subSubCategories.length > 0 ? `
                            <div class="group-hover/subcategory:block left-full absolute -inset-px hidden bg-background shadow-md border size-[calc(100%_+_2px)]">
                                <div class="bg-secondary px-base py-xs h-12 font-bold text-muted-foreground">Popular Topics</div>
                                <div class="h-[calc(100%_-_3rem)] overflow-y-scroll">
                                    ${subCategory.subSubCategories.map(subSubCategory => `
                                        <a class="block hover:bg-secondary px-base py-xs text-foreground hover:text-active cursor-pointer" href="${subSubCategory.href}">
                                            <div class="flex justify-between items-center gap-base">
                                                <span>${subSubCategory.category_name}</span>
                                            </div>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : ''}
`;


            container.appendChild(categoryDiv);
        });
    };

    // Initialize rendering
    const container = document.querySelector("#nav-categories-container");
    renderCategories(container, categoryDatas);
});

// Mobile Nav
document.addEventListener("DOMContentLoaded", () => {
    const mobileSidebarNavOpen = document.querySelector("[data-mobile-sidebar-nav-open]")
    const mobileSidebarNavClose = document.querySelectorAll("[data-mobile-sidebar-nav-close]")
    const mobileSidebarNavCategoryButton = document.querySelectorAll("[data-mobile-sidebar-nav-category-button]")
    const mobileSidebarNavSubCategory = document.querySelector("[data-mobile-sidebar-nav-sub-category]")
    const mobileSidebarNavSubCategoryClose = document.querySelectorAll("[data-mobile-sidebar-nav-sub-category-close]")
    const sidebar = document.getElementById("mobile-sidebar-nav");
    const subNav = document.getElementById("subNav");

    // Close sidebar and sub-navigation
    function closeAll() {
        sidebar.classList.add("hidden");
        subNav.classList.add("hidden");
    }

    mobileSidebarNavOpen.addEventListener("click", () => {
        sidebar.classList.add("block");
        sidebar.classList.remove("hidden");
    });

    mobileSidebarNavClose.forEach(elemment => (
        elemment.addEventListener("click", () => {
            sidebar.classList.add("hidden");
            sidebar.classList.remove("block");
        })
    ))

    mobileSidebarNavSubCategoryClose.forEach(elemment => (
        elemment.addEventListener("click", () => {
            mobileSidebarNavSubCategory.classList.add("left-full");
            mobileSidebarNavSubCategory.classList.remove("left-0");
        })
    ))

    mobileSidebarNavCategoryButton.forEach(elemment => (
        elemment.addEventListener("click", () => {
            mobileSidebarNavSubCategory.classList.add("left-0");
            mobileSidebarNavSubCategory.classList.remove("left-full");
        })
    ))
});