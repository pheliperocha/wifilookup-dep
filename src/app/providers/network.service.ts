import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Host } from '../models/host';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NetworkService {

  public defaultIPGateway: string;
  private _hosts: Host[] = null;
  public hostsSubject = new BehaviorSubject<Host[]>(this._hosts);

  private isScanning: boolean = false;
  private gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this.getDefaultIPGateway();
    }
  }

  setHosts(hosts: Host[]) {
    this._hosts = hosts;
    this.hostsSubject.next(hosts);
  }

  getHosts(): Observable<Host[]> {
    return this.hostsSubject.asObservable();
  }

  private getDefaultIPGateway() {
    console.log('Getting Gateway IP');

    let data = this.electronService.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(this.gatewayRegex);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork(_cb) {
    if (this.isScanning) {
      return false;
    }

    this.isScanning = true;
    console.log('Starting ScanNetwork');

    var quickscan = new this.electronService.nmap.QuickScan(this.defaultIPGateway + '/24');

    quickscan.on('complete', (data) => {
      this.setHosts(data);
      this.isScanning = false;
      return _cb(null, data);
    });

    quickscan.on('error', (error)  => {
      this.isScanning = false;
      return _cb(error);
    });

    quickscan.startScan();
  }

  public scanHost(host: Host, _cb) {
    if (this.isScanning) {
      return false;
    }

    this.isScanning = true;
    console.log('Starting ScanHost');

    var osAndPortScan = new this.electronService.nmap.OsAndPortScan(host.ip);

    osAndPortScan.on('complete', (data: Host) => {
      let hostIndex = this._hosts.findIndex((value) => {
        return (value.ip === host.ip);
      });

      if (data[0].ip === host.ip) {
        this._hosts[hostIndex] = data[0];
        this.hostsSubject.next(this._hosts);
      }

      this.isScanning = false;
      return _cb(null, data);
    });

    osAndPortScan.on('error', function(error) {
      this.isScanning = false;
      return _cb(error);
    });

    osAndPortScan.startScan();
  }

  public verifyHost(host: Host) {
    console.log('Starting Scan');

    var quickscan = new this.electronService.nmap.QuickScan(host.ip);

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
  }

}
