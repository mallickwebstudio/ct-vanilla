// console.log("layout")

export const categoryDatas = [
    {
        "category_id": "2",
        "slug": "professional",
        "icon": "",
        "parent_id": null,
        "category_name": "Professional",
        "subCategories": [
            {
                "category_id": "430",
                "slug": "graphic-designing",
                "icon": "/store/1/default_images/categories_icons/graphic-icon.svg",
                "parent_id": "2",
                "category_name": "Graphic Designing",
                "href": "online/professional/graphic-designing",
                "subSubCategories": [
                    {
                        "category_id": "436",
                        "slug": "animation",
                        "icon": "",
                        "parent_id": "430",
                        "category_name": "Animation",
                        "href": "online/professional/graphic-designing/animation"
                    }
                ]
            },
            {
                "category_id": "517",
                "slug": "healthcare-medical",
                "icon": "/store/1/default_images/categories_icons/healthcare-icon.svg",
                "parent_id": "2",
                "category_name": "Healthcare and Medical",
                "href": "online/professional/healthcare-medical",
                "subSubCategories": [
                    {
                        "category_id": "545",
                        "slug": "diet-nutrition",
                        "icon": "",
                        "parent_id": "517",
                        "category_name": "Diet and Nutrition",
                        "href": "online/professional/healthcare-medical/diet-nutrition"
                    }
                ]
            },
            {
                "category_id": "853",
                "slug": "video-editing",
                "icon": "/store/1/default_images/categories_icons/photography.svg",
                "parent_id": "2",
                "category_name": "Video Editing",
                "href": "online/professional/video-editing",
                "subSubCategories": [
                    {
                        "category_id": "854",
                        "slug": "after-effects",
                        "icon": "",
                        "parent_id": "853",
                        "category_name": "Adobe After Effects",
                        "href": "online/professional/video-editing/after-effects"
                    }
                ]
            }
        ],
        "href": "online/professional"
    },
    {
        "category_id": "7",
        "slug": "language",
        "icon": "",
        "parent_id": null,
        "category_name": "Language",
        "subCategories": [
            {
                "category_id": "1072",
                "slug": "english",
                "icon": "/store/1/default_images/categories_icons/english-symbol.svg",
                "parent_id": "7",
                "category_name": "English",
                "href": "online/language/english",
                "subSubCategories": [
                    {
                        "category_id": "1076",
                        "slug": "business-english",
                        "icon": "",
                        "parent_id": "1072",
                        "category_name": "Business English",
                        "href": "online/language/english/business-english"
                    },
                    {
                        "category_id": "1087",
                        "slug": "spoken-english",
                        "icon": "",
                        "parent_id": "1072",
                        "category_name": "Spoken English",
                        "href": "online/language/english/spoken-english"
                    }
                ]
            }
        ],
        "href": "online/language"
    }
]

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

// Initialize rendering Categories
document.addEventListener("DOMContentLoaded", () => {
    // Initialize rendering
    const container = document.querySelector("#nav-categories-container");
    renderCategories(container, categoryDatas);
});

// Mobile Sidebar Nav
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