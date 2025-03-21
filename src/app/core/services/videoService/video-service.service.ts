import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VideoServiceService {
  private socket = io(environment.SOCKET_URL); // Connect to backend
  private peerConnection!: RTCPeerConnection;
  private config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  startStream(videoElement: HTMLVideoElement) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        videoElement.srcObject = stream;
        this.setupWebRTC(stream);
      })
      .catch(err => console.error('Error accessing camera:', err));
  }

  private setupWebRTC(stream: MediaStream) {
    this.peerConnection = new RTCPeerConnection(this.config);
    stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    this.socket.on('ice-candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.peerConnection.createOffer().then(offer => {
      this.peerConnection.setLocalDescription(offer);
      this.socket.emit('offer', offer);
    });

    this.socket.on('offer', (offer) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      this.peerConnection.createAnswer().then(answer => {
        this.peerConnection.setLocalDescription(answer);
        this.socket.emit('answer', answer);
      });
    });

    this.socket.on('answer', (answer) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });
  }
}
