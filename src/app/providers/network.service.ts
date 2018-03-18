import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Device } from '../models/device';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NetworkService {

  public defaultIPGateway: string;
  public devices = new Subject<Device[]>();

  private gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this.getDefaultIPGateway();
    }
  }

  setDevices(devices: Device[]) {
    this.devices.next(devices);
  }

  getDevices(): Observable<Device[]> {
    return this.devices.asObservable();
  }

  private getDefaultIPGateway() {
    console.log('Getting Gateway IP');

    let data = this.electronService.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(this.gatewayRegex);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork(_cb) {
    console.log('Starting Scan');

    var quickscan = new this.electronService.nmap.QuickScan(this.defaultIPGateway + '/24');

    quickscan.on('complete', (data) => {
      this.setDevices(data);
      return _cb(null, data);
    });

    quickscan.on('error', (error)  => {
      return _cb(error);
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
