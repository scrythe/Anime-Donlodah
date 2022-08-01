import { Component, OnInit } from '@angular/core';
import {
  faWindowMinimize,
  faSquare,
  faWindowRestore,
} from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
  isMaximizeable = false;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    this.electronService.getIsMaximized().subscribe(() => {
      this.isMaximizeable = true;
    });
    this.electronService.getIsRestored().subscribe(() => {
      this.isMaximizeable = false;
    });
    // on('isMaximized', () => (this.isMaximizeable = true));
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
