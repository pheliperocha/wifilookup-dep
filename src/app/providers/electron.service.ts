import { Injectable } from '@angular/core';

import { ipcRenderer, remote } from 'electron';
import * as childProcess from 'child_process';
import { Device } from '../models/device';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  remote: typeof remote;
  defaultIPGateway: string;
  private nmap: any;

  public devices: Device[];

  public gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;

  constructor() {
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
      this.remote = window.require('electron').remote;
      this.nmap = this.remote.require('node-nmap');
      this.getDefaultIPGateway();
      // this.scanNetwork();
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

    quickscan.on('complete', (data) => {
      this.devices = data;

      console.log(this.devices);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

  public scanDevice(device: Device) {
    console.log('Starting Scan');

    var quickscan = new this.nmap.OsAndPortScan(device.ip);

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

  public verifyDevice(device: Device) {
    console.log('Starting Scan');

    var quickscan = new this.nmap.QuickScan(device.ip);

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

}
