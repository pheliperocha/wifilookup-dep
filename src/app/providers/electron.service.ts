import { Injectable } from '@angular/core';
import { ipcRenderer, remote, shell } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {

  public ipcRenderer: typeof ipcRenderer;
  public childProcess: typeof childProcess;
  public remote: typeof remote;
  public shell: typeof shell;
  public nmap: any;

  constructor() {
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.remote = window.require('electron').remote;
      this.shell = window.require('electron').shell;
      this.nmap = this.remote.require('node-nmap');
    }
  }

  public isElectron() {
    return window && window.process && window.process.type;
  };

  public closeWindow() {
    this.remote.getCurrentWindow().close();
  }

  public minimizeWindow() {
    this.remote.getCurrentWindow().minimize();
  }

  public openExternal(url: string) {
    this.shell.openExternal(url);
  }
}
