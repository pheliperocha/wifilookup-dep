import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('pt');

    if (electronService.isElectron()) {
      AppConfig.appMode = 'electron';
    } else {
      AppConfig.appMode = 'web';
    }

    console.log('AppConfig', AppConfig);
  }

  close() {
    this.electronService.closeWindow();
  }

  minimize() {
    this.electronService.minimizeWindow();
  }
}
