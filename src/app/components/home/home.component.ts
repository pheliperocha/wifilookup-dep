import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NetworkService } from '../../providers/network.service';
import { Device } from '../../models/device';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public devices: Device[];
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    public networkService: NetworkService,
    private _ngZone: NgZone
  ) {
    this.networkService.getDevices().takeUntil(this.ngUnsubscribe).subscribe((devices: Device[]) => {
      this._ngZone.run(() => {
        this.devices = devices;
      });
    });
  }

  ngOnInit() {
    console.log('Loading start');
    this.networkService.scanNetwork((err, data) => {
      console.log('Loading end');
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
