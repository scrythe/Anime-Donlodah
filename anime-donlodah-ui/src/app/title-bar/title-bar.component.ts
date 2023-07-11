import { Component, OnInit } from '@angular/core';
import {
  faWindowMinimize,
  faSquare,
  faWindowRestore,
} from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';
import { ElectronService } from '../electron-service/electron.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css'],
})
export class TitleBarComponent implements OnInit {
  minimizeIcon = faWindowMinimize;
  maximizeMaximizeIcon = faSquare;
  closeIcon = faXmark;
  isMaximized$?: boolean;
  $updateSizeValue?: BehaviorSubject<boolean>;
  tempText = '';

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    // this.updateIsMaximized();
    this.electronService.windowSizeChange().subscribe((res) => {
      this.isMaximized$ = res;
      console.log(res);
    });
    // on('isMaximized', () => (this.isMaximizeable = true));

    this.electronService.test().subscribe((res) => (this.tempText = res));
  }

  updateIsMaximized() {
    this.electronService
      .isMaximized()
      .subscribe((res) => (this.isMaximized$ = res));
  }

  minimize() {
    this.electronService.send('minimizeApp');
  }

  maximize() {
    this.electronService.send('maximizeApp');
  }

  close() {
    this.electronService.send('closeApp');
  }
}
