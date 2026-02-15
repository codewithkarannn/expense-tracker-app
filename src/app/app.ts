import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';


import {ThemeService} from '../services/theme-service';
import {Toast} from '../components/shared/toast/toast';
import {ThemeController} from '../components/shared/theme-controller/theme-controller';
import {NavBar} from '../components/shared/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ThemeController, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit {
  protected readonly title = signal('budget-tracker-app-latest');

  theme = signal('light');
  themeService =  inject(ThemeService);

  ngOnInit() {
    this.themeService.setTheme(this.theme());
  }
}
