import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private electronService: ElectronService) {}

  ngOnInit() {}

  openExternal(url: string) {
    this.electronService.openExternal(url);
  }
}
