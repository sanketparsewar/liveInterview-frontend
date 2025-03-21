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
  @Input() showWebcam: boolean = false;
  multipleWebcamsAvailable: boolean = false;

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices.length > 1;
      })
      .catch(err => console.error('Error accessing webcams:', err));
  }

  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
}

