import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private alertService: AlertService, private router: Router) { }
  savedTheme: string = '';
  isDarkMode: boolean = false;
  ngOnInit() {
    this.savedTheme = localStorage.getItem('isDarkMode') || '';
    this.isDarkMode = (this.savedTheme=="true") ? false : true;
    this.toggleDarkMode();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  back() {
    history.back();
  }
  logout() {
    this.alertService.showConfirm('Logout').then((isConfirmed: any) => {
      if (isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.alertService.showSuccess('Logged out.')
        this.router.navigateByUrl('/login')
      }
    });
  }
}
