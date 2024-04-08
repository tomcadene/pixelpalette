// Listens for any changes in Chrome's local storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'colors' && newValue.length > 0) {
            const latestColor = newValue[newValue.length - 1]; // Get the last color
            updateBadgeWithLatestColor(latestColor); // Update badge color
        }
    }
});

// Function to update the badge color
function updateBadgeWithLatestColor(color) {
    const {r, g, b, a} = hexToRGBA(color);
    chrome.action.setBadgeBackgroundColor({color: [r, g, b, a]});
    chrome.action.setBadgeText({ text: ' ' }); // Opting for no text on the badge
}

// Assuming 'color' is in the format '#RRGGBB'
function hexToRGBA(hex) {
    if (hex.length !== 7) {
        return {r: 0, g: 0, b: 0, a: 255};
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {r, g, b, a: 255}; // Alpha set to 255 (fully opaque)
}
