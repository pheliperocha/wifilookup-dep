import { Injectable } from '@angular/core';

import { ipcRenderer, remote } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  remote: typeof remote;
  defaultIPGateway: string;
  private nmap: any;

  public gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;
  public ipv4Regex = new RegExp(/([0-9]{1,3}\.){3}[0-9]{1,3}(([0-9]|[1-2][0-9]|3[0-2]))?/g);
  public macRegex = new RegExp(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g);
  public deviceNameRegex = new RegExp(/\([a-zA-Z][\S]+(([\s])|([a-zA-Z]+)|\.|,)+\)/g);

  constructor() {
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.remote = window.require('electron').remote;
      this.nmap = this.remote.require('node-nmap');

      this.getDefaultIPGateway();
    }
  }

  public isElectron() {
    return window && window.process && window.process.type;
  };

  private getDefaultIPGateway() {
    let data = this.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(this.gatewayRegex);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork() {
    console.log('Starting Scan');

    var quickscan = new this.nmap.QuickScan(this.defaultIPGateway + '/24');

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

  public scanDevice(ip: string) {
    this.nmap = this.childProcess.spawn('nmap', ['-sP', ip]);
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

}
