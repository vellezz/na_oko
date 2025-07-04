# Na Oko – Chrome/Firefox Extension

**Na Oko** is a Chrome/FireFox extension designed for pixel-perfect web development and UI comparison. It allows you to overlay images (such as design mockups or screenshots) directly on any website, making it easy to compare layouts, check alignment, and ensure visual accuracy.

## Features

- **Overlay Images:** Add, manage, and position multiple overlays on any webpage.
- **Clipboard & File Support:** Paste images directly from the clipboard (Ctrl+Shift+V) or upload files.
- **Overlay List Panel:** View, reorder, and remove overlays from a convenient panel.
- **Opacity & Scale Controls:** Adjust overlay transparency and scale for precise comparison.
- **Negative Filter:** Instantly invert overlay colors for better contrast.
- **Theme Support:** Switch between light and dark themes.
- **Persistent State:** Overlays and settings are saved and restored automatically.
- **Drag & Drop:** Move overlays freely on the page.
- **Modern UI:** Built with Vite, TypeScript, and SCSS for fast development and maintainability.

## Technologies Used

- **TypeScript**
- **Vite**
- **SCSS**
- **Chrome Extensions API**

## Installation

You can install the extension either from source or using a pre-built ZIP from the Releases page.

### 1. From Source

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/na-oko.git
   cd na-oko
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Build the extension:**

   ```
   npm run build
   ```

4. **Load the extension in Chrome:**
   - Open `chrome://extensions/` in your browser.
   - Enable "Developer mode" (top right).
   - Click "Load unpacked" and select the `dist` folder from the project directory.

---

### 2. From Release ZIP

1. **Download the latest release ZIP** from the [Releases page](https://github.com/cellezz/na-oko/releases).

2. **Extract the ZIP** to a folder on your computer.

3. **Load the extension in Chrome:**
   - Open `chrome://extensions/` in your browser.
   - Enable "Developer mode" (top right).
   - Click "Load unpacked" and select the extracted folder.

---

## Project Structure

```
na-oko/
├── dist/                # Production build output
├── public/              # Static assets and HTML templates
│   └── templates/       # HTML templates for UI panels
├── src/                 # Source code (TypeScript, logic, components)
│   ├── overlay-manager.ts
│   ├── overlay-panel.ts
│   └── ...              # Other scripts and modules
├── .vscode/             # VS Code editor settings (optional)
├── package.json         # Project metadata and dependencies
├── vite.config.js       # Vite build configuration
└── ...                  # Other configuration and support files

```

## Support

If you have questions, encounter bugs, or want to suggest features, please open an [issue](https://github.com/vellezz/na-oko/issues) on GitHub.

## License & Usage

This project and the Chrome extension are **completely free and open source**.  
You are allowed to use, modify, and distribute the code and extension for any purpose, including commercial use.

**No commercial support is provided.**  
Use at your own risk.

This project is licensed under the [MIT License](LICENSE).
