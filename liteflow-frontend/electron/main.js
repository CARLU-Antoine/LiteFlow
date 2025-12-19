// electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
function createWindow() {
const win = new BrowserWindow({
  width: 1200,
  height: 600,
  resizable: true
});


  // DEV
  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools();



  // PROD
  // win.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(createWindow);
