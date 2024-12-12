import { parseResponsiveValues, debounce } from "./utils.js";
import { breakpoints } from "./utils.js";

export class Accordion { // Accordion Component
    constructor(element) {
        this.element = element;
        this.items = Array.from(this.element.querySelectorAll('[data-accordion-item]'));
        this.defaultItem = this.element.getAttribute('data-accordion-default-value');

        this.init();
    }

    isItemOpen(item) {
        const content = item.querySelector('[data-accordion-content]');
        return content.style.height && content.style.height !== '0px';
    }

    openItem(item) {
        const content = item.querySelector('[data-accordion-content]');

        // Dynamically set height based on content's scrollHeight
        content.style.height = `${content.scrollHeight}px`;

        // Add padding to the parent accordion item
        item.classList.add('pb-base');

        // Remove any "collapsed" padding class
        item.classList.remove('pb-0');
    }

    closeItem(item) {
        const content = item.querySelector('[data-accordion-content]');

        // Reset height to collapse
        content.style.height = '0';

        // Remove expanded padding and add collapsed padding
        item.classList.add('pb-0');
        item.classList.remove('pb-base');
    }

    init() {
        this.items.forEach(item => {
            const trigger = item.querySelector('[data-accordion-trigger]');
            const content = item.querySelector('[data-accordion-content]');

            // Set initial state based on data-accordion-default-value
            const defaultValue = this.element.getAttribute('data-accordion-default-value');
            if (item.getAttribute('data-accordion-item') === defaultValue) {
                this.openItem(item);
            }

            // Add event listener to the trigger
            trigger.addEventListener('click', () => {
                const isActive = this.isItemOpen(item);

                if (!isActive) {
                    this.openItem(item);
                } else {
                    this.closeItem(item);
                }
            });
        });
    }

}



export class Carousel { // Carousel
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
            if (!isDragging) return; // Ensure the drag has started
            isDragging = false; // Reset dragging state
        
            const slideWidth = this.container.offsetWidth / this.slidesToShow; // Width of one slide
            const threshold = slideWidth * 0.10; // 25% of the slide width
        
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    // Dragged to the right (move to the previous slide)
                    this.currentIndex = Math.max(this.currentIndex - 1, 0);
                } else {
                    // Dragged to the left (move to the next slide)
                    this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - this.slidesToShow);
                }
            }
        
            // Reset the transform to snap to the appropriate slide
            this.content.style.transition = ''; // Re-enable transition for snapping
            this.updateCarousel(); // Update carousel to reflect the new slide position
            deltaX = 0; // Reset deltaX for future drags
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


export function setupResponsiveCarousel() { // Responsive Carousel
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



export class Modal { // Modal
    constructor(element) {
        this.element = element;
        this.overlay = this.element.querySelector('[data-modal-overlay]');
        this.closeButtons = Array.from(this.element.querySelectorAll('[data-modal-close], [data-modal-cancel]'));
        this.init();
    }

    init() {
        // Set up close button event listeners
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });

        // Set up overlay click to close the modal
        this.overlay?.addEventListener('click', () => this.close());

        // Close modal on Escape key press
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !this.element.classList.contains('hidden')) {
                this.close();
            }
        });
    }

    open() {
        this.element.classList.remove('hidden');
        this.element.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.element.classList.add('hidden');
        this.element.classList.remove('flex');
        document.body.style.overflow = '';
    }
}



export class Tabs { // Tabs
    constructor(element) {
        this.element = element;
        this.tabPanel = this.element.querySelector('[data-tab-panel]');
        this.buttons = Array.from(this.tabPanel.querySelectorAll('[data-tab-key]'));
        this.contents = Array.from(this.element.querySelectorAll('[data-tab-content]'));

        // Initialize the active tab
        this.activeTabKey = this.buttons[0]?.getAttribute('data-tab-key') || null;

        this.init();
    }

    init() {
        // Set up event listeners for tab buttons
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.setActiveTab(button.getAttribute('data-tab-key'));
            });
        });

        // Set the initial state
        this.setActiveTab(this.activeTabKey);
    }

    setActiveTab(tabKey) {
        this.activeTabKey = tabKey;

        // Update buttons
        this.buttons.forEach(button => {
            if (button.getAttribute('data-tab-key') === tabKey) {
                button.classList.add(...['active', 'bg-secondary']); // Add active class
            } else {
                button.classList.remove(...['active', 'bg-secondary']); // Remove active class
            }
        });

        // Update content
        this.contents.forEach(content => {
            if (content.getAttribute('data-tab-content') === tabKey) {
                content.classList.remove('hidden'); // Show active content
            } else {
                content.classList.add('hidden'); // Hide inactive content
            }
        });
    }
}



export class Select { // Select
    constructor(element) {
        this.element = element;
        this.trigger = this.element.querySelector('[data-select-trigger]');
        this.container = this.element.querySelector('[data-select-container]');
        this.items = Array.from(this.element.querySelectorAll('[data-select-item]'));
        this.textDisplay = this.trigger.querySelector('[data-select-text]');
        this.init();
    }

    init() {
        // Toggle the select container visibility on trigger click
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleActive();
        });

        // Set up event listeners for each item
        this.items.forEach((item) => {
            item.addEventListener('click', () => {
                this.selectItem(item);
            });
        });

        // Close the dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Keyboard accessibility
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleActive();
            }
        });

        this.items.forEach((item) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectItem(item);
                }
            });
        });
    }

    toggleActive() {
        this.trigger.classList.toggle('active');
        if (this.trigger.classList.contains('active')) {
            this.container.classList.add('block');
            this.container.classList.remove('hidden');
        } else {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        this.trigger.classList.remove('active');
        this.container.classList.remove('block');
        this.container.classList.add('hidden');
    }

    selectItem(item) {
        const value = item.getAttribute('value');
        const text = item.textContent.trim();

        // Update the displayed text
        this.textDisplay.textContent = text;

        // Mark the selected item visually (optional)
        this.items.forEach((item) => item.classList.remove('active'));
        item.classList.add('active');

        // Close the dropdown
        this.closeDropdown();

        // Dispatch a custom event with the selected value
        this.element.dispatchEvent(new CustomEvent('select:change', {
            detail: { value, text },
            bubbles: true,
        }));
    }
}



export class Toast { // Toast
    constructor(element) {
        this.element = element;
        this.container = this.element.querySelector('[data-toast-container]');
        this.init();
    }

    init() {
        // Ensure the toast container is hidden initially
        this.element.classList.add('hidden');
    }

    showToast({ title, description }) {
        // Ensure the toast element is visible
        this.element.classList.remove('hidden');
        this.element.classList.add('block');

        // Create a new toast item
        const toastItem = document.createElement('div');
        toastItem.setAttribute('data-toast-item', '');

        toastItem.innerHTML = `
        <div data-toast-close>
        <img src="./images/icon/x.svg" alt="Close Icon" />
        </div>
            ${title ? `<div class="font-bold">${title}</div>` : ''}
            ${description ? `<p class="text-sm">${description}</p>` : ''}
        `;

        // Append the toast item to the container
        this.container.appendChild(toastItem);

        // Set up the close functionality
        const closeButton = toastItem.querySelector('[data-toast-close]');
        closeButton.addEventListener('click', () => {
            this.dismissToast(toastItem);
        });

        // Automatically dismiss the toast after 7 seconds
        setTimeout(() => {
            this.dismissToast(toastItem);
        }, 7000);
    }

    dismissToast(toastItem) {
        if (toastItem) {
            toastItem.classList.add('opacity-0'); // Add fade-out animation
            setTimeout(() => {
                toastItem.remove(); // Remove from DOM after fade-out
                this.hideIfEmpty();
            }, 300); // Adjust duration to match CSS transition
        }
    }

    hideIfEmpty() {
        if (!this.container.querySelector('[data-toast-item]')) {
            this.element.classList.add('hidden'); // Hide the toast container if empty
        }
    }
}




// Initialize the toast component
const toastElement = document.querySelector('[data-toast]');
const toastInstance = new Toast(toastElement);

// Global toast function
export function toast({ title, description }) {
    if (toastInstance) {
        toastInstance.showToast({ title, description });
    }
}

// Initialize all custom select components
document.querySelectorAll('[data-select]').forEach((selectElement) => {
    new Select(selectElement);
});


// INITILIZE COMPONENTS
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-accordion]').forEach(accordionElement => {
        new Accordion(accordionElement);
    });



    document.querySelectorAll('[data-carousel]').forEach(carouselElement => {
        new Carousel(carouselElement);
    });



    const modals = Array.from(document.querySelectorAll('[data-modal]')).map(
        modalElement => new Modal(modalElement)
    );
    // Set up buttons to open modals
    document.querySelectorAll('[data-modal-button]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-button');
            const modal = modals.find(modal => modal.element.dataset.modal === modalId);
            modal?.open();
        });
    });



    document.querySelectorAll('[data-tab]').forEach(tabElement => {
        new Tabs(tabElement);
    });



    setupResponsiveCarousel();
});
