import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';
import { ChildProcess } from 'child_process';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  defaultIPGateway: string;
  private nmap: ChildProcess;

  constructor() {
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.getDefaultIPGateway();
      // this.scanNetwork();
    }
  }

  public isElectron() {
    return window && window.process && window.process.type;
  };

  private getDefaultIPGateway() {
    let data = this.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork() {
    this.nmap = this.childProcess.spawn('nmap', ['-sP', this.defaultIPGateway + '/24']);
    this.nmap.stdout.setEncoding('utf8');

    this.nmap.stdout.on('data', function (data) {
      console.log('data =======');
      console.log(data);
    });

    this.nmap.stdout.on('close', function (data) {
      console.log('Exit =======');
      console.log(data);
    });

    this.nmap.stdout.on('error', function (data) {
      console.log('Error =======');
      console.log(data);
    });
  }

  public scanDevice() {

  }

}
