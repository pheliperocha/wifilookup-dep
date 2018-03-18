import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NetworkService } from '../../providers/network.service';
import { Host } from '../../models/host';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public hosts: Host[];
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    public networkService: NetworkService,
    private _ngZone: NgZone
  ) {
    this.networkService.getHosts().takeUntil(this.ngUnsubscribe).subscribe((hosts: Host[]) => {
      this._ngZone.run(() => {
        this.hosts = hosts;
      });
    });
  }

  ngOnInit() {
    this.networkService.wifilookup();
  }

  scanHost(host: Host) {
    console.log('Loading start');
    this.networkService.scanHost(host, (err, data) => {
      console.log('Loading end');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
