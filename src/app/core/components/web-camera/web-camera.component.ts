import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebcamModule, WebcamUtil } from 'ngx-webcam';
import { AlertService } from '../../services/alert/alert.service';
@Component({
  selector: 'app-web-camera',
  imports: [WebcamModule, FormsModule, CommonModule],
  templateUrl: './web-camera.component.html',
  styleUrl: './web-camera.component.css'
})
export class WebCameraComponent {
  // @Input() showWebcam: boolean = false;
  multipleWebcamsAvailable: boolean = false;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices.length > 1;
      })
      .catch(err => this.alertService.showError(err));
  }

  // toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }
}

