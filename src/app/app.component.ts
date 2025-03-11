import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isDarkMode = false;
  constructor() {}

  ngOnInit() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        this.isDarkMode = event.matches;
        localStorage.setItem('isDarkMode', event.matches.toString());
        document.documentElement.classList.toggle('dark', this.isDarkMode);
      });
  }

}
