import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Device } from '../models/device';

@Injectable()
export class NetworkService {

  public defaultIPGateway: string;
  public devices: Device[];

  private gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this.getDefaultIPGateway();
      this.scanNetwork();
    }
  }

  private getDefaultIPGateway() {
    console.log('Getting Gateway IP');

    let data = this.electronService.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(this.gatewayRegex);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork() {
    console.log('Starting Scan');

    var quickscan = new this.electronService.nmap.QuickScan(this.defaultIPGateway + '/24');

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

    var quickscan = new this.electronService.nmap.OsAndPortScan(device.ip);

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

    var quickscan = new this.electronService.nmap.QuickScan(device.ip);

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

}
