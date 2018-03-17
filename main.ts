import { app, BrowserWindow, screen, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';

const electron = require('electron');
const args = process.argv.slice(1);
const iconPath = path.join(__dirname, 'src/favicon.png');
const Menu = electron.Menu;

let networkWin: BrowserWindow,
  serve: boolean,
  tray: Tray = null;

serve = args.some(val => val === '--serve');

try {
  require('dotenv').config();
} catch(err) {
  console.trace('Error on require dotenv');
  console.error(err);
}

const menuTemplate = [
  {
    label: 'Network',
    click: () => { networkWin.show() }
  },
  {
    label: 'Settings'
  },
  {
    label: 'About'
  },
  {
    label: 'Exit',
    click: () => { app.exit() }
  }
];

try {
  app.on('ready', () => {
    this.tray = new Tray(iconPath);

    const ctxMenu = Menu.buildFromTemplate(menuTemplate);
    this.tray.setContextMenu(ctxMenu);

    createNetworkWindow();
  });
} catch(err) {
  console.trace('Problem on Ready');
  console.error(err);
}

function createNetworkWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  networkWin = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    show: false,
    center: true
  });

  if (serve) {
    require('electron-reload')(__dirname, {});
    networkWin.loadURL('http://localhost:4200');
  } else {
    networkWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  networkWin.once('ready-to-show', () => {
    if (process.env.DEBUG) {
      networkWin.webContents.openDevTools();
    }
  });
}
