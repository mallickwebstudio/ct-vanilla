// console.log("utils")

export const breakpoints = {
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "2xl": 1536,
}

export function formatNumber(number, locale) {
    return number.toLocaleString(locale || 'en-US');
}


export function parseResponsiveValues(responsiveString) {
    const regex = /(\w+):([\d.]+)/g; // Supports integers and decimals
    const result = {};

    let match;
    while ((match = regex.exec(responsiveString)) !== null) {
        const [, breakpoint, value] = match;
        result[breakpoint] = parseFloat(value);
    }

    return result;
}

export function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}