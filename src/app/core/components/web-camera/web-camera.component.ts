import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebcamModule, WebcamUtil } from 'ngx-webcam';
@Component({
  selector: 'app-web-camera',
  imports: [WebcamModule, FormsModule, CommonModule],
  templateUrl: './web-camera.component.html',
  styleUrl: './web-camera.component.css'
})
export class WebCameraComponent {
  @Input() showWebcam: boolean =false;
  multipleWebcamsAvailable: boolean = false;

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
}

