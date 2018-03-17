import { app, BrowserWindow, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';

const electron = require('electron');
const args = process.argv.slice(1);
const iconPath16 = path.join(__dirname, 'src/assets/icon/icons8-wi-fi-16.png');
const iconPath64 = path.join(__dirname, 'src/assets/icon/icons8-wi-fi-64.png');
const Menu = electron.Menu;

let networkWin: BrowserWindow,
  aboutWin: BrowserWindow,
  serve: boolean,
  tray: Tray = null,
  isQuiting: boolean = false;

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
    label: 'About',
    click: () => { aboutWin.show() }
  },
  {
    label: 'Exit',
    click: () => {
      isQuiting = true;
      app.quit();
    }
  }
];

try {
  app.on('ready', () => {
    tray = new Tray(iconPath16);
    tray.setToolTip('WifiLookup');

    const ctxMenu = Menu.buildFromTemplate(menuTemplate);
    tray.setContextMenu(ctxMenu);

    tray.on('click', () => {
      networkWin.isVisible() ? networkWin.hide() : networkWin.show();
    });

    tray.displayBalloon({
      icon: iconPath64,
      title: 'WifiLookup',
      content: 'Scanning networking...'
    });

    createNetworkWindow();
    createAboutWindow();
  });

  app.on('before-quit', () => {
    networkWin.removeAllListeners('close');
    networkWin.close();
    networkWin = null;
  });
} catch(err) {
  console.trace('Problem on listening app event');
  console.error(err);
}

function createNetworkWindow() {
  networkWin = new BrowserWindow({
    icon: iconPath64,
    width: 900,
    height: 600,
    show: false,
    center: true,
    frame: false,
    alwaysOnTop: true
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
    networkWin.show();

    if (process.env.ENV !== 'prod' && process.env.DEBUG === 'true') {
      networkWin.webContents.openDevTools();
    }
  });

  networkWin.on('close', function (event) {
    if(!isQuiting) {
      event.preventDefault();
      networkWin.hide();
    }
    return false;
  });
}

function createAboutWindow() {
  aboutWin = new BrowserWindow({
    icon: iconPath64,
    width: 350,
    height: 514,
    show: false,
    center: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true
  });

  if (serve) {
    require('electron-reload')(__dirname, {});
    aboutWin.loadURL('http://localhost:4200/#/about');
  } else {
    aboutWin.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html#/about'),
      protocol: 'file:',
      slashes: true
    }));
  }

  aboutWin.on('close', function (event) {
    if(!isQuiting) {
      event.preventDefault();
      aboutWin.hide();
    }
    return false;
  });
}
