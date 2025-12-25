// electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
function createWindow() {
const win = new BrowserWindow({
  width: 1500,
  height: 800,
  resizable: true,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
  }
});


  // DEV
  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools();



  // PROD
  // win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(createWindow);
