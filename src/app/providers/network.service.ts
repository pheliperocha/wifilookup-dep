import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Host } from '../models/host';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HostsMock } from '../mocks/hostsMock';

@Injectable()
export class NetworkService {

  public defaultIPGateway: string;
  private _hosts: Host[] = null;
  public hostsSubject = new BehaviorSubject<Host[]>(this._hosts);

  private isScanning: boolean = false;
  private hostIndexScanning: number = 0;
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

  public wifilookup() {
    this.scanNetwork((err) => {
      if (err) {
        console.error(err);
        return err;
      }

      this.deepScanNetwork((err) => {
        if (err) {
          console.error(err);
          return err;
        }

        setInterval(() => { this.wifilookup(); }, 300000);
      });
    });
  }

  public wifilookupMock() {
    this.setHosts(HostsMock);
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

  public deepScanNetwork(_cb) {
    if (this.isScanning) {
      return false;
    }

    if (this.hostIndexScanning == this._hosts.length) {
      this.hostIndexScanning = 0;
      return _cb();
    }

    this.scanHost(this._hosts[this.hostIndexScanning], (err, data) => {
      if (err) {
        console.error(err);
        return false;
      }

      this.hostIndexScanning++;
      this.deepScanNetwork(_cb);
    });

    return _cb(null);
  }

  public scanHost(host: Host, _cb) {
    if (this.isScanning) {
      return false;
    }

    this.isScanning = true;
    console.log('Starting ScanHost');

    let hostIndex = this._hosts.findIndex((value) => {
      return (value.ip === host.ip);
    });

    this._hosts[hostIndex].scanning = true;
    this.hostsSubject.next(this._hosts);

    let osAndPortScan = new this.electronService.nmap.OsAndPortScan(host.ip);

    osAndPortScan.on('complete', (data: Host) => {
      if (!data[0]) {
        this._hosts[hostIndex].status = 'inactive';
        this._hosts[hostIndex].scanning = false;
        this.isScanning = false;
        this.hostsSubject.next(this._hosts);

        this.verifyHost(hostIndex, _cb);

        return false;
      }

      if (data[0].ip === host.ip) {
        this._hosts[hostIndex] = data[0];
        this._hosts[hostIndex].status = 'online';
      }

      this.isScanning = false;
      this._hosts[hostIndex].scanning = false;
      this.hostsSubject.next(this._hosts);

      return _cb(null, data);
    });

    osAndPortScan.on('error', function(error) {
      this.isScanning = false;
      this._hosts[hostIndex].scanning = false;
      this.hostsSubject.next(this._hosts);
      return _cb(error);
    });

    osAndPortScan.startScan();
  }

  public verifyHost(hostIndex: number, _cb) {
    if (this.isScanning) {
      return false;
    }

    this.isScanning = true;
    console.log('Starting verify host');

    this._hosts[hostIndex].scanning = true;
    this.hostsSubject.next(this._hosts);

    var quickscan = new this.electronService.nmap.QuickScan(this._hosts[hostIndex].ip);

    quickscan.on('complete', (data) => {
      if (!data[0]) {
        if (this._hosts[hostIndex].try > 5) {
          this._hosts[hostIndex].status = 'offline';
          this._hosts[hostIndex].scanning = false;
          this.isScanning = false;
          this.hostsSubject.next(this._hosts);

          return _cb(null, data);
        }

        this._hosts[hostIndex].status = 'inactive';
        this._hosts[hostIndex].scanning = false;
        this._hosts[hostIndex].try = !this._hosts[hostIndex].try ? 1 : this._hosts[hostIndex].try + 1;
        this.isScanning = false;
        this.hostsSubject.next(this._hosts);

        setTimeout(() => {
          this.verifyHost(hostIndex, _cb);
        }, 1000 * this._hosts[hostIndex].try);
        return false;
      }

      if (data[0].ip === this._hosts[hostIndex].ip) {
        this._hosts[hostIndex] = data[0];
        this._hosts[hostIndex].status = 'online';
      }

      this.isScanning = false;
      this._hosts[hostIndex].scanning = false;
      this.hostsSubject.next(this._hosts);

      return _cb(null, data);
    });

    quickscan.on('error', (err) => {
      this.isScanning = false;
      this._hosts[hostIndex].scanning = false;
      this.hostsSubject.next(this._hosts);
      console.error(err);
    });

    quickscan.startScan();
  }

}
