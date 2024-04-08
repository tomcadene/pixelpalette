// Listens for any changes in Chrome's local storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('Storage change detected:', changes);
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'colors' && newValue.length > 0) {
            console.log('Colors array updated. Latest color:', newValue[newValue.length - 1]);
            const latestColor = newValue[newValue.length - 1]; // Get the last color
            updateBadgeWithLatestColor(latestColor); // Update badge color
        }
    }
});

// Function to update the badge color
function updateBadgeWithLatestColor(color) {
    const {r, g, b, a} = hexToRGBA(color);
    console.log(`Updating badge color to: rgba(${r}, ${g}, ${b}, ${a})`);
    chrome.action.setBadgeBackgroundColor({color: [r, g, b, a]}, () => {
        console.log(`Badge background color set to: ${color}`);
    });
    chrome.action.setBadgeText({ text: ' ' }); // Opting for no text on the badge
    console.log('Badge text set to empty'); // Check if the badge text update is called
}

// Assuming 'color' is in the format '#RRGGBB'
function hexToRGBA(hex) {
    if (hex.length !== 7) {
        console.log(`Invalid HEX color: ${hex}. Defaulting to black.`);
        return {r: 0, g: 0, b: 0, a: 255};
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    console.log(`Converted HEX to RGBA: ${hex} to rgba(${r}, ${g}, ${b}, 255)`);
    return {r, g, b, a: 255}; // Alpha set to 255 (fully opaque)
}
