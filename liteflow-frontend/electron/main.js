// electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
require("./ipc");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true
    }
  });

  // DEV
  win.loadURL("http://localhost:5173");

  // PROD
  // win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(createWindow);
