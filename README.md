# Tailspin Toys

This repository contains the project for a 1 hour guided workshop to explore GitHub Copilot Agent Mode and related features in Visual Studio Code. The project is a website for a fictional game crowd-funding company, with a [Flask](https://flask.palletsprojects.com/en/stable/) backend using [SQLAlchemy](https://www.sqlalchemy.org/) and [Astro](https://astro.build/) frontend using [Svelte](https://svelte.dev/) for dynamic pages.

To begin the workshop, start at [docs/README.md](./docs/README.md)

Or, if just want to run the app...

## Launch the site

A script file has been created to launch the site. You can run it by:

```bash
./scripts/start-app.sh
```

Then navigate to the [website](http://localhost:4321) to see the site!

## Sudoku Game

A beautiful, modern Sudoku game has been added to this repository as a separate mini-application:

### Features
- **Modern dark theme UI** with beautiful gradients and animations
- **Complete Sudoku functionality**: puzzle generation, solving, and validation
- **Multiple difficulty levels**: Easy, Medium, Hard
- **Interactive gameplay**: Click cells and numbers, or use keyboard input
- **Real-time validation** with visual feedback for correct/incorrect moves
- **Game statistics**: Timer and error counter
- **Responsive design** that works on desktop, tablet, and mobile

### How to play
1. Navigate to the `sudoku-game` folder
2. Open `index.html` in your browser, or serve it with a local server:
   ```bash
   cd sudoku-game
   python3 -m http.server 8080
   ```
3. Open http://localhost:8080 in your browser
4. Select difficulty and click "新遊戲" (New Game) to start playing!

See [sudoku-game/README.md](./sudoku-game/README.md) for detailed documentation.

## License 

This project is licensed under the terms of the MIT open source license. Please refer to the [LICENSE](./LICENSE) for the full terms.

## Maintainers 

You can find the list of maintainers in [CODEOWNERS](./.github/CODEOWNERS).

## Support

This project is provided as-is, and may be updated over time. If you have questions, please open an issue.
