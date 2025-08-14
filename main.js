const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const GAME_URL = 'https://only2004.com/client?world=1&detail=high&method=0';
let mainWindow;

// Store loaded plugins
const plugins = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1450,
    height: 760,
    resizable: true,
    title: 'only2004 Client',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: true,
      webSecurity: false,
      plugins: true,
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(GAME_URL);

  //buildMenu();
}

// Load plugins from /plugins folder
function loadPlugins() {
  const pluginDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginDir)) return;

  fs.readdirSync(pluginDir).forEach(folder => {
    const pluginPath = path.join(pluginDir, folder, 'main.js');
    if (fs.existsSync(pluginPath)) {
      try {
        const plugin = require(pluginPath);
        if (plugin.name && plugin.register) {
          plugins[plugin.name] = plugin;
        }
      } catch (err) {
        console.error(`Failed to load plugin ${folder}:`, err);
      }
    }
  });
}

// Build menu with plugin entries
//function buildMenu() {
//  const pluginItems = Object.values(plugins).map(p => ({
//    label: p.name,
//    click: () => p.register(mainWindow)
//  }));
//
//  const template = [
//    { label: 'File', submenu: [{ role: 'quit' }] },
//    { label: 'View', submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }] },
//    { label: 'Plugins', submenu: pluginItems }
//  ];
//
//  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
//}

// Example message box from plugins
ipcMain.handle('show-message', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});

app.whenReady().then(() => {
  app.commandLine.appendSwitch('disable-renderer-backgrounding');
  app.commandLine.appendSwitch('disable-background-timer-throttling');
  app.commandLine.appendSwitch('ignore-gpu-blacklist');

  loadPlugins();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
