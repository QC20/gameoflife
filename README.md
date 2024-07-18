# Game of Life Simulation

This project implements Conway's Game of Life, a cellular automaton simulation, using JavaScript and HTML5 Canvas.

## Overview

The Game of Life is a zero-player game developed by mathematician John Conway. It simulates a grid of cells which evolve over time based on a set of rules. This implementation creates a visually striking, full-screen animation of the Game of Life.

## Features

- Full-screen canvas animation
- Randomized initial state
- Responsive design that adapts to window resizing
- Customizable cell size and grid dimensions
- Adjustable game rules (minimum and maximum neighbors for cell survival)

## Technical Details

The simulation is built using:

- HTML5 for structure
- CSS for styling and full-screen display
- JavaScript for game logic and animation

Key components:

- `canvas`: Used for rendering the game grid
- `cell` class: Represents individual cells in the grid
- `draw()` function: Handles the main game loop and cell updates
- `requestAnimFrame()`: Ensures smooth animation across different browsers

## Rules

In this implementation:

1. Any live cell with 2 or 3 live neighbors survives.
2. Any dead cell with 3 live neighbors becomes a live cell.
3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

## Customization

You can easily modify the game parameters by adjusting the following rules:

- `rules.cells`: Controls the number of cells vertically
- `rules.min` and `rules.max`: Determine the rules for cell survival and reproduction

## Performance

The game uses efficient algorithms to calculate cell states and render the grid, allowing for smooth animation even with large numbers of cells.

## Future Enhancements

Potential areas for future development include:

- User controls for starting, stopping, and resetting the simulation
- Color customization options
- Ability to draw initial patterns
- Performance optimizations for even larger grids

## Credits

This project was inspired by John Conway's Game of Life and implemented using modern web technologies.