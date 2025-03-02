import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  showSuccess(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: message,
    });
  }

  showError(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title: message,
    });
  }
  // showWarning(message: string) {
  //   this.toastr.warning(message);
  // }
  // showInfo(message: string) {
  //   this.toastr.info(message);
  // }

  showConfirm(message: string): Promise<boolean> {
    return Swal.fire({
      text: `Are you sure you want to ${message}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result: any) => result.isConfirmed);
  }
}
