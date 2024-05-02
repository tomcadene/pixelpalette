// Listens for any changes in Chrome's local storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log('Storage change detected:', changes);
    if (changes.latestColor) {
        console.log('Latest color updated:', changes.latestColor.newValue);
        updateBadgeWithLatestColor(changes.latestColor.newValue); // Update badge color with the latest color
    }
});

// Function to update the badge color based on the latest color
function updateBadgeWithLatestColor(hexColor) {
    const { r, g, b, a } = hexToRGBA(hexColor);
    console.log(`Updating badge color to: rgba(${r}, ${g}, ${b}, ${a})`);
    chrome.action.setBadgeBackgroundColor({ color: [r, g, b, a] }, () => {
        console.log(`Badge background color set to: ${hexColor}`);
    });
    chrome.action.setBadgeText({ text: ' ' }); // Opting for no text on the badge
    console.log('Badge text set to empty'); // Confirm badge text update
}

// Function to convert HEX color to RGBA
function hexToRGBA(hex) {
    if (hex.length !== 7) {
        console.log(`Invalid HEX color: ${hex}. Defaulting to black.`);
        return { r: 0, g: 0, b: 0, a: 255 };
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: 255 }; // Alpha set to 255 (fully opaque)
}
