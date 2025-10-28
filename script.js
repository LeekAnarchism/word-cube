// Default letters for each face
const DEFAULT_LETTERS = {
    front: 'ABCDEFGHIJKLMNOPQRSTUVWXY',
    back: 'ZYXWVUTSRQPONMLKJIHGFEDCB',
    right: 'AEIOUAEIOUAEIOUAEIOUAEIOU',
    left: 'BCDFGBCDFGBCDFGBCDFGBCDFG',
    top: 'HELLOWORLDHELLOWORLDHELLO',
    bottom: 'CUBEROTATIONCUBEROTATION'
};

// Cube rotation state
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotation = { x: -20, y: 20 };

// Get DOM elements
const cube = document.getElementById('cube');
const inputs = {
    front: document.getElementById('front-input'),
    back: document.getElementById('back-input'),
    right: document.getElementById('right-input'),
    left: document.getElementById('left-input'),
    top: document.getElementById('top-input'),
    bottom: document.getElementById('bottom-input')
};

// Initialize the cube
function initCube() {
    // Load letters from query parameters or use defaults
    const letters = loadFromQueryParams();
    
    // Update input fields
    Object.keys(inputs).forEach(face => {
        inputs[face].value = letters[face];
    });
    
    // Render the cube
    renderCube(letters);
    
    // Apply initial rotation
    updateCubeRotation();
}

// Load letters from query parameters
function loadFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const letters = {};
    
    Object.keys(DEFAULT_LETTERS).forEach(face => {
        const paramValue = params.get(face);
        if (paramValue && paramValue.length === 25) {
            letters[face] = paramValue;
        } else {
            letters[face] = DEFAULT_LETTERS[face];
        }
    });
    
    return letters;
}

// Save letters to query parameters
function saveToQueryParams(letters) {
    const params = new URLSearchParams();
    
    Object.keys(letters).forEach(face => {
        params.set(face, letters[face]);
    });
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

// Render the cube with letters
function renderCube(letters) {
    Object.keys(letters).forEach(face => {
        const faceElement = document.querySelector(`[data-face="${face}"]`);
        faceElement.innerHTML = '';
        
        const faceLetters = letters[face].padEnd(25, ' ');
        
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = faceLetters[i];
            faceElement.appendChild(cell);
        }
    });
}

// Update cube rotation
function updateCubeRotation() {
    cube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
}

// Mouse drag handlers
cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;
    
    rotation.y += deltaX * 0.5;
    rotation.x -= deltaY * 0.5;
    
    updateCubeRotation();
    
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Touch handlers for mobile
let previousTouchPosition = { x: 0, y: 0 };

cube.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    previousTouchPosition = { x: touch.clientX, y: touch.clientY };
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - previousTouchPosition.x;
    const deltaY = touch.clientY - previousTouchPosition.y;
    
    rotation.y += deltaX * 0.5;
    rotation.x -= deltaY * 0.5;
    
    updateCubeRotation();
    
    previousTouchPosition = { x: touch.clientX, y: touch.clientY };
    e.preventDefault();
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Apply button handler
document.getElementById('apply-btn').addEventListener('click', () => {
    const letters = {};
    
    Object.keys(inputs).forEach(face => {
        let value = inputs[face].value;
        // Pad with spaces if less than 25 characters
        if (value.length < 25) {
            value = value.padEnd(25, ' ');
        }
        // Truncate if more than 25 characters (shouldn't happen with maxlength)
        letters[face] = value.substring(0, 25);
    });
    
    renderCube(letters);
    saveToQueryParams(letters);
    
    // Show feedback
    const btn = document.getElementById('apply-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Applied!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
});

// Share button handler
document.getElementById('share-btn').addEventListener('click', () => {
    const url = window.location.href;
    
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('share-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Link Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
    }).catch(err => {
        alert('Failed to copy link: ' + err);
    });
});

// Reset button handler
document.getElementById('reset-btn').addEventListener('click', () => {
    Object.keys(inputs).forEach(face => {
        inputs[face].value = DEFAULT_LETTERS[face];
    });
    
    renderCube(DEFAULT_LETTERS);
    saveToQueryParams(DEFAULT_LETTERS);
    
    // Show feedback
    const btn = document.getElementById('reset-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Reset!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
});

// Initialize on page load
initCube();
