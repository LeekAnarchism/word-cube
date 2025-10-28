# 3D Letter Cube Web App

A beautiful, interactive 3D cube with customizable 5x5 letter grids on each face. The cube can be rotated with mouse/touch gestures, and the state is preserved via URL query parameters.

## Features

- **3D Rotatable Cube**: Drag with mouse or touch to rotate the cube in 3D space
- **Customizable Letters**: Each of the 6 faces has a 5x5 grid (25 letters) that can be customized
- **Persistent State**: Letter configurations are stored in URL query parameters and loaded on startup
- **Share Links**: Copy the current configuration as a shareable URL
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## How to Use

1. Open `index.html` in a web browser
2. Drag the cube to rotate it and view different faces
3. Enter 25 letters in each input box (one for each face)
4. Click "Apply Changes" to update the cube
5. Click "Copy Share Link" to get a shareable URL with your configuration
6. Click "Reset to Default" to restore the default letters

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and 3D transformations
- `script.js` - Cube rotation logic and state management

## Default Letters

- **Front**: ABCDEFGHIJKLMNOPQRSTUVWXY
- **Back**: ZYXWVUTSRQPONMLKJIHGFEDCB
- **Right**: AEIOUAEIOUAEIOUAEIOUAEIOU
- **Left**: BCDFGBCDFGBCDFGBCDFGBCDFG
- **Top**: HELLOWORLDHELLOWORLDHELLO
- **Bottom**: CUBEROTATIONCUBEROTATION

## Technical Details

- Pure HTML, CSS, and JavaScript (no dependencies)
- CSS 3D transforms for cube rendering
- URL query parameters for state persistence
- Touch and mouse event handlers for rotation
