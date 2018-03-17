import { app, BrowserWindow, screen, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';

const electron = require('electron');
const args = process.argv.slice(1);
const iconPath = path.join(__dirname, 'src/favicon.png');
const Menu = electron.Menu;

let networkWin: BrowserWindow,
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
    label: 'About'
  },
  {
    label: 'Exit',
    click: () => { isQuiting = true; app.quit(); }
  }
];

try {
  app.on('ready', () => {
    tray = new Tray(iconPath);
    tray.setToolTip('WifiLookup');

    const ctxMenu = Menu.buildFromTemplate(menuTemplate);
    tray.setContextMenu(ctxMenu);

    tray.on('click', () => {
      networkWin.isVisible() ? networkWin.hide() : networkWin.show();
    });

    tray.displayBalloon({
      icon: './src/favicon.png',
      title: 'WifiLookup',
      content: 'Scanning networking...'
    });

    createNetworkWindow();
  });
} catch(err) {
  console.trace('Problem on Ready');
  console.error(err);
}

function createNetworkWindow() {
  networkWin = new BrowserWindow({
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
