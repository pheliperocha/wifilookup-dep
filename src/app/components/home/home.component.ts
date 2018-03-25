import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NetworkService } from '../../providers/network.service';
import { Host } from '../../models/host';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { AppConfig } from '../../app.config';

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
    if (AppConfig.appMode === 'electron') {
      this.networkService.wifilookup();
    } else {
      this.networkService.wifilookupMock();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
