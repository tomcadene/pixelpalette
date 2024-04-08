// Function to save color to Chrome's local storage
function saveColor(color) {
    chrome.storage.local.get({ colors: [] }, (result) => {
        let colors = result.colors;
        colors.push(color); // Add the new color
        if (colors.length > 5) {
            colors = colors.slice(-5); // Keep only the last 5 colors
        }
        chrome.storage.local.set({ colors: colors }, () => {
            console.log('Color saved:', color);
            updateUIWithColors(colors); // Update the UI with the new color list
        });
    });
}

// Function to update the UI with the saved colors
function updateUIWithColors(colors) {
    const colorsList = document.getElementById('pickedColors');
    colorsList.innerHTML = ''; // Clear current list
    colors.forEach((color) => {
        const colorElement = document.createElement('div');
        colorElement.textContent = color;
        colorsList.appendChild(colorElement);
    });
}

// Function that activates the EyeDropper API and handles the color picking process
async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        const color = result.sRGBHex;
        document.getElementById('pickedColor').textContent = `Picked color: ${color}`;
        saveColor(color); // Save the picked color
    } catch (error) {
        document.getElementById('pickedColor').textContent = 'Error picking color.';
        console.error('Error picking color:', error);
    }
}

// Load and display saved colors when the popup is opened
chrome.storage.local.get({ colors: [] }, (result) => {
    updateUIWithColors(result.colors);
});

document.getElementById('pickColor').addEventListener('click', pickColor);
