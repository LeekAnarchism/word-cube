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
const inputGrids = {};

// Initialize the cube
function initCube() {
    // Load letters from query parameters or use defaults
    const letters = loadFromQueryParams();
    
    // Create input grids for each face
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach(face => {
        const gridContainer = document.querySelector(`.grid-input[data-face="${face}"]`);
        inputGrids[face] = [];
        
        const graphemes = getGraphemes(letters[face]);
        
        for (let i = 0; i < 25; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'grid-cell';
            input.maxLength = 2; // Allow for emojis
            input.value = graphemes[i] || ' ';
            input.dataset.index = i;
            input.dataset.face = face;
            
            // Select all content when focused
            input.addEventListener('focus', (e) => {
                e.target.select();
            });
            
            // Auto-advance to next cell on input
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                const chars = getGraphemes(value);
                if (chars.length > 1) {
                    e.target.value = chars[0];
                }
                
                // Auto-advance to next cell
                if (e.target.value && i < 24) {
                    const nextInput = gridContainer.querySelector(`input[data-index="${i + 1}"]`);
                    if (nextInput) nextInput.focus();
                }
            });
            
            // Handle keyboard navigation
            input.addEventListener('keydown', (e) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                let targetIndex = null;
                
                switch(e.key) {
                    case 'ArrowUp':
                        if (row > 0) {
                            targetIndex = i - 5;
                        }
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        if (row < 4) {
                            targetIndex = i + 5;
                        }
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        if (col > 0) {
                            targetIndex = i - 1;
                        }
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        if (col < 4) {
                            targetIndex = i + 1;
                        }
                        e.preventDefault();
                        break;
                    case 'Backspace':
                        if (!e.target.value && i > 0) {
                            const prevInput = gridContainer.querySelector(`input[data-index="${i - 1}"]`);
                            if (prevInput) {
                                prevInput.focus();
                                prevInput.select();
                            }
                        }
                        break;
                }
                
                if (targetIndex !== null) {
                    const targetInput = gridContainer.querySelector(`input[data-index="${targetIndex}"]`);
                    if (targetInput) {
                        targetInput.focus();
                        targetInput.select();
                    }
                }
            });
            
            gridContainer.appendChild(input);
            inputGrids[face].push(input);
        }
    });
    
    // Render the cube
    renderCube(letters);
    
    // Apply initial rotation
    updateCubeRotation();
}

// Helper function to split string into array of grapheme clusters (handles emojis correctly)
function getGraphemes(str) {
    return Array.from(str);
}

// Load letters from query parameters
function loadFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const letters = {};
    
    Object.keys(DEFAULT_LETTERS).forEach(face => {
        const paramValue = params.get(face);
        if (paramValue && getGraphemes(paramValue).length === 25) {
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
        
        // Split into grapheme clusters to handle emojis correctly
        const graphemes = getGraphemes(letters[face]);
        
        // Pad with spaces if less than 25
        while (graphemes.length < 25) {
            graphemes.push(' ');
        }
        
        // Only use first 25 graphemes
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = graphemes[i] || ' ';
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
    
    Object.keys(inputGrids).forEach(face => {
        const graphemes = [];
        inputGrids[face].forEach(input => {
            const value = input.value || ' ';
            const chars = getGraphemes(value);
            graphemes.push(chars[0] || ' ');
        });
        
        letters[face] = graphemes.join('');
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
    Object.keys(inputGrids).forEach(face => {
        const graphemes = getGraphemes(DEFAULT_LETTERS[face]);
        inputGrids[face].forEach((input, i) => {
            input.value = graphemes[i] || ' ';
        });
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
