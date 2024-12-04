import { breakpoints } from "./const.js";
console.log("utils")

export function formatNumber(number, locale) {
    return number.toLocaleString(locale || 'en-US');
}

export class Carousel {
    constructor(element) {
        this.element = element;
        this.container = this.element.querySelector('[data-carousel-container]');
        this.content = this.element.querySelector('[data-carousel-content]');
        this.items = Array.from(this.content.querySelectorAll('[data-carousel-item]'));
        this.prevButton = this.element.querySelector('[data-carousel-prev-button]');
        this.nextButton = this.element.querySelector('[data-carousel-next-button]');

        this.currentIndex = 0;

        this.slidesToShow = this.calculateSlidesToShow();

        this.init();
    }

    calculateSlidesToShow() {
        const slidesToShow = this.content.getAttribute('data-slides-to-show');
        return slidesToShow && !isNaN(slidesToShow) ? parseFloat(slidesToShow) : 1;
    }    

    init() {
        this.updateCarousel();
        this.addEventListeners();

        // Update on `update-carousel` event
        this.content.addEventListener('update-carousel', () => {
            this.slidesToShow = this.calculateSlidesToShow();
            this.updateCarousel();
        });
    }

    updateCarousel() {
        const slideWidth = 100 / this.slidesToShow;
        this.content.style.transform = `translateX(-${this.currentIndex * slideWidth}%)`;
        this.items.forEach((item) => {
            item.style.flexBasis = `${slideWidth}%`;
        });
        this.updateButtonsVisibility();
        this.items.forEach((item) => {
            const trigger = item.querySelector('[data-popup-trigger]');
            if (trigger) {
                trigger.addEventListener('mouseenter', () => this.adjustPopoverPosition());
            }
        });

    }

    updateButtonsVisibility() {
        if (!this.prevButton || !this.nextButton) return;

        if (this.currentIndex === 0) {
            this.prevButton.classList.add("hidden");
            this.prevButton.classList.remove("flex");
        } else {
            this.prevButton.classList.add("flex");
            this.prevButton.classList.remove("hidden");
        }

        if (this.currentIndex >= this.items.length - this.slidesToShow) {
            this.nextButton.classList.add("hidden");
            this.nextButton.classList.remove("flex");
        } else {
            this.nextButton.classList.add("flex");
            this.nextButton.classList.remove("hidden");
        }
    }

    adjustPopoverPosition() {
        this.items.forEach((item) => {
            const popover = item.querySelector('[data-popup-content]');
            const trigger = item.querySelector('[data-popup-trigger]');

            if (popover && trigger) {
                // Reset to default position
                popover.setAttribute('data-popup-content', 'right');

                // Get bounding boxes
                const popoverRect = popover.getBoundingClientRect();
                const containerRect = this.container.getBoundingClientRect();

                // Check if popover overflows the container
                if (popoverRect.right > containerRect.right) {
                    popover.setAttribute('data-popup-content', 'left');
                }
            }
        });
    }

    next() {
        if (this.currentIndex < this.items.length - this.slidesToShow) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to start
        }
        this.updateCarousel();
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.items.length - this.slidesToShow;
        }
        this.updateCarousel();
    }

    addEventListeners() {
        this.prevButton.addEventListener('click', () => {
            this.prev();
        });
        this.nextButton.addEventListener('click', () => {
            this.next();
        });

        // Drag functionality (as previously updated)
        let startX = 0, deltaX = 0, isDragging = false;

        const onDragStart = (e) => {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            this.content.style.transition = 'none'; // Disable transition for smooth dragging
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            deltaX = currentX - startX;

            const slideWidth = this.container.offsetWidth / this.slidesToShow;
            this.content.style.transform = `translateX(calc(-${this.currentIndex * (100 / this.slidesToShow)}% + ${(deltaX / slideWidth) * (100 / this.slidesToShow)}%))`;
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            const slideWidth = this.container.offsetWidth / this.slidesToShow;
            const slidesMoved = Math.round(deltaX / slideWidth);

            this.content.style.transition = ''; // Re-enable transition for snapping
            if (slidesMoved > 0) {
                this.currentIndex = Math.max(this.currentIndex - slidesMoved, 0);
            } else if (slidesMoved < 0) {
                this.currentIndex = Math.min(this.currentIndex - slidesMoved, this.items.length - this.slidesToShow);
            }

            this.updateCarousel();
        };

        this.container.addEventListener('mousedown', onDragStart);
        this.container.addEventListener('mousemove', onDragMove);
        this.container.addEventListener('mouseup', onDragEnd);
        this.container.addEventListener('mouseleave', onDragEnd);

        this.container.addEventListener('touchstart', onDragStart);
        this.container.addEventListener('touchmove', onDragMove);
        this.container.addEventListener('touchend', onDragEnd);

        // Window resize to update carousel dynamically
        window.addEventListener('resize', () => {
            this.slidesToShow = this.calculateSlidesToShow();
            this.updateCarousel();
        });
    }
}

// Initialize carousel
document.querySelectorAll('[data-carousel').forEach((carouselElement) => {
    new Carousel(carouselElement);
});

function setupResponsiveCarousel() {
    const carousels = document.querySelectorAll('[data-carousel-content]');

    carousels.forEach((carousel) => {
        const responsiveValues = carousel.getAttribute('data-slides-to-show');
        if (!responsiveValues) return;

        const parsedValues = parseResponsiveValues(responsiveValues);

        function updateSlidesToShow() {
            const screenWidth = window.innerWidth;

            // Default fallback
            let slidesToShow = parsedValues['default'] || 1;

            // Check for specific breakpoints
            for (const breakpoint of Object.keys(parsedValues)) {
                if (breakpoint !== 'default' && screenWidth >= breakpoints[breakpoint]) {
                    slidesToShow = parsedValues[breakpoint];
                }
            }

            // Update the attribute dynamically
            carousel.setAttribute('data-slides-to-show', slidesToShow);

            // Notify the Carousel class of the change
            carousel.dispatchEvent(new Event('update-carousel'));
        }

        // Debounce resize handling for performance
        const debouncedUpdate = debounce(updateSlidesToShow, 100);

        // Listen for screen size changes
        window.addEventListener('resize', debouncedUpdate);

        // Initialize on page load
        updateSlidesToShow();
    });
}

function parseResponsiveValues(responsiveString) {
    const regex = /(\w+):([\d.]+)/g; // Supports integers and decimals
    const result = {};

    let match;
    while ((match = regex.exec(responsiveString)) !== null) {
        const [, breakpoint, value] = match;
        result[breakpoint] = parseFloat(value);
    }

    return result;
}


function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', setupResponsiveCarousel);