import { Injectable } from '@angular/core';

import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';
import { ChildProcess } from 'child_process';
import { Devices } from '../models/device';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;
  defaultIPGateway: string;
  private nmap: ChildProcess;
  public devices: Devices[] = [];

  public gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;
  public ipv4Regex = new RegExp(/([0-9]{1,3}\.){3}[0-9]{1,3}(([0-9]|[1-2][0-9]|3[0-2]))?/g);
  public macRegex = new RegExp(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g);
  public deviceNameRegex = new RegExp(/\([a-zA-Z][\S]+(([\s])|([a-zA-Z]+)|\.|,)+\)/g);

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

    let ip = data.match(this.gatewayRegex);
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

  public mockScanNetwork() {
    const result = "Nmap scan report for 192.168.1.1\n" +
      "Host is up (0.0020s latency).\n" +
      "MAC Address: E4:18:6B:12:90:EE (ZyXEL Communications)\n" +
      "Nmap scan report for 192.168.1.3\n" +
      "Host is up (1.3s latency).\n" +
      "MAC Address: CC:C3:EA:4E:EC:E6 (Motorola Mobility, a Lenovo Company)\n" +
      "Nmap scan report for 192.168.1.5\n" +
      "Host is up (0.077s latency).\n" +
      "MAC Address: 6C:AD:F8:54:29:52 (AzureWave Technology)\n" +
      "Nmap scan report for 192.168.1.8\n" +
      "Host is up (0.25s latency).\n" +
      "MAC Address: D4:63:C6:51:C2:C6 (Motorola Mobility, a Lenovo Company)\n" +
      "Nmap scan report for 192.168.1.10\n" +
      "Host is up (0.23s latency).\n" +
      "MAC Address: 74:E5:43:DB:B5:6F (Liteon Technology)\n" +
      "Nmap scan report for 192.168.1.12\n" +
      "Host is up (0.33s latency).\n" +
      "MAC Address: 90:FB:A6:75:A3:33 (Hon Hai Precision Ind.)\n" +
      "Nmap scan report for 192.168.1.13\n" +
      "Host is up (0.40s latency).\n" +
      "MAC Address: 54:27:1E:F9:00:E0 (AzureWave Technology)\n" +
      "Nmap scan report for 192.168.1.148\n" +
      "Host is up (1.5s latency).\n" +
      "MAC Address: EE:08:6B:F8:F7:70 (Unknown)\n" +
      "Nmap scan report for 192.168.1.4\n" +
      "Host is up.\n" +
      "Nmap done: 256 IP addresses (9 hosts up) scanned in 34.77 seconds";

    let hosts = result.match(this.ipv4Regex);
    let mac = result.match(this.macRegex);
    let name = result.match(this.deviceNameRegex);

    hosts.forEach((value, index) => {
      this.devices.push({
        ip: value,
        mac: mac[index],
        name: name[index]
      })
    });

    console.log(result);
    console.log(this.devices);
  }

  public scanDevice() {

  }

}
