import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Host } from '../models/host';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NetworkService {

  public defaultIPGateway: string;
  public hosts = new Subject<Host[]>();

  private gatewayRegex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/g;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron()) {
      this.getDefaultIPGateway();
    }
  }

  setHost(hosts: Host[]) {
    this.hosts.next(hosts);
  }

  getHosts(): Observable<Host[]> {
    return this.hosts.asObservable();
  }

  private getDefaultIPGateway() {
    console.log('Getting Gateway IP');

    let data = this.electronService.childProcess.execSync('WMIC NICConfig where IPEnabled="True" get DefaultIPGateway /value | find "I"').toString();

    let ip = data.match(this.gatewayRegex);
    this.defaultIPGateway = ip[0];
  }

  public scanNetwork(_cb) {
    console.log('Starting ScanNetwork');

    var quickscan = new this.electronService.nmap.QuickScan(this.defaultIPGateway + '/24');

    quickscan.on('complete', (data) => {
      this.setHost(data);
      return _cb(null, data);
    });

    quickscan.on('error', (error)  => {
      return _cb(error);
    });

    quickscan.startScan();
  }

  public scanHost(host: Host) {
    console.log('Starting ScanHost');

    var quickscan = new this.electronService.nmap.OsAndPortScan(host.ip);

    quickscan.on('complete', function(data) {
      console.log(data);
    });

    quickscan.on('error', function(error) {
      console.log(error);
    });

    quickscan.startScan();
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
