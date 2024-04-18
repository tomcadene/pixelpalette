// Function that activates the EyeDropper API and handles the color picking process
async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        const hexColor = result.sRGBHex;
        const rgbColor = hexToRGB(hexColor);
        const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
        const hslColor = rgbToHSL(r, g, b);

        const colorInfo = { hex: hexColor, rgb: rgbColor, hsl: hslColor };
        const pickedColorElement = document.getElementById('pickedColor');
        pickedColorElement.textContent = `Picked color: ${hexColor}, ${rgbColor}, ${hslColor}`;
        pickedColorElement.style.backgroundColor = hexColor; // Visual display of the color
        pickedColorElement.style.color = '#FFF'; // Ensure text is visible
        pickedColorElement.style.padding = '10px';
        
        saveColor(colorInfo); // Save the picked color with all formats
    } catch (error) {
        const pickedColorElement = document.getElementById('pickedColor');
        pickedColorElement.textContent = 'Error picking color.';
        console.error('Error picking color:', error);
    }
}

// Function to save color to Chrome's local storage
function saveColor(colorInfo) {
    chrome.storage.local.get({ colors: [] }, (result) => {
        let colors = result.colors;
        colors.push(colorInfo); // Add the new color info
        if (colors.length > 5) {
            colors = colors.slice(-5); // Keep only the last 5 colors
        }
        // Save the colors array and the latest color separately
        chrome.storage.local.set({ colors: colors, latestColor: colorInfo.hex }, () => {
            console.log('Color saved:', colorInfo);
            updateUIWithColors(colors); // Update the UI with the new color list
        });
    });
}

// Convert Hex to RGB
function hexToRGB(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// Convert RGB to HSL
function rgbToHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `hsl(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
}


// Function to update the UI with the saved colors
function updateUIWithColors(colors) {
    // Hide all color boxes initially
    for (let i = 1; i <= 5; i++) {
        const colorBox = document.getElementById(`color${i}`);
        colorBox.style.display = 'none';
    }

    // Update visible color boxes with color info
    colors.forEach((colorInfo, index) => {
        if (index < 5) { // Only update the first 5 boxes
            const colorBox = document.getElementById(`color${index + 1}`);
            colorBox.style.backgroundColor = colorInfo.hex;
            colorBox.style.display = 'block'; // Make the box visible
            colorBox.textContent = `Hex: ${colorInfo.hex}, RGB: ${colorInfo.rgb}, HSL: ${colorInfo.hsl}`;
        }
    });
}


// Load and display saved colors when the popup is opened
chrome.storage.local.get({ colors: [] }, (result) => {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving colors:", chrome.runtime.lastError);
    } else {
        updateUIWithColors(result.colors);
    }
});

document.getElementById('pickColor').addEventListener('click', pickColor);
